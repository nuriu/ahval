using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using Ajanda.Authentication;
using Ajanda.Helpers;
using Ajanda.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Ajanda.Controllers
{
    public class JwtTokenController : Controller
    {
        private AjandaDbContext db;

        private readonly JwtTokenOptions jwtTokenOptions;
        private readonly ILogger logger;
        private readonly JsonSerializerSettings serializerSettings;

        public JwtTokenController(IOptions<JwtTokenOptions> tokenOptions,
                                  ILoggerFactory loggerFactory,
                                  AjandaDbContext databaseContext)
        {
            jwtTokenOptions = tokenOptions.Value;
            ThrowIfInvalidOptions(jwtTokenOptions);

            logger = loggerFactory.CreateLogger<JwtTokenController>();

            serializerSettings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented
            };

            db = databaseContext;
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("api/authenticate")]
        public async Task<IActionResult> Get([FromBody]User user)
        {
            var identity = await GetClaimsIdentity(user);

            if (identity == null)
            {
                logger.LogInformation($"Invalid username ({user.Username}) or password ({user.Password})");
                return BadRequest("Invalid credentials");
            }

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, await jwtTokenOptions.JtiGenerator()),
                new Claim(JwtRegisteredClaimNames.Iat,
                ToUnixEpochDate(jwtTokenOptions.IssuedAt).ToString(), ClaimValueTypes.Integer64),
                identity.FindFirst("DisneyCharacter")
            };

            var jwt = new JwtSecurityToken(
                issuer: jwtTokenOptions.Issuer,
                audience: jwtTokenOptions.Audience,
                claims: claims,
                notBefore: jwtTokenOptions.NotBefore,
                expires: jwtTokenOptions.Expiration,
                signingCredentials: jwtTokenOptions.SigningCredentials);

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            var response = new
            {
                access_token = encodedJwt,
                expires_in = (int)jwtTokenOptions.ValidFor.TotalSeconds
            };

            var json = JsonConvert.SerializeObject(response, serializerSettings);
            return new OkObjectResult(json);
        }

        private static void ThrowIfInvalidOptions(JwtTokenOptions options)
        {
            if (options == null) throw new ArgumentNullException(nameof(options));

            if (options.ValidFor <= TimeSpan.Zero)
            {
                throw new ArgumentException("Must be a non-zero TimeSpan.", nameof(JwtTokenOptions.ValidFor));
            }

            if (options.SigningCredentials == null)
            {
                throw new ArgumentNullException(nameof(JwtTokenOptions.SigningCredentials));
            }

            if (options.JtiGenerator == null)
            {
                throw new ArgumentNullException(nameof(JwtTokenOptions.JtiGenerator));
            }
        }

        private long ToUnixEpochDate(DateTime date) => (long)Math.Round((
                date.ToUniversalTime() - new DateTimeOffset(1970, 1, 1, 0, 0, 0, TimeSpan.Zero)
            ).TotalSeconds);

        private Task<ClaimsIdentity> GetClaimsIdentity(User user)
        {
            // check for user
            var dbUser = db.Users.FirstOrDefault(u => u.Username == user.Username);
            // if user exists
            if (dbUser != null)
            {   
                // if right password entered
                if (CryptoHelper.VerifyHashedPassword(dbUser.Password, user.Password))
                {
                    // update last logged in time
                    dbUser.LastLoggedInAt = DateTime.UtcNow;
                    // save changes
                    db.Entry(dbUser).State = EntityState.Modified;
                    db.SaveChangesAsync();

                    return Task.FromResult(new ClaimsIdentity(
                        new GenericIdentity(user.Username, "Token"),
                        new[]
                        {
                            new Claim(ClaimTypes.NameIdentifier, user.Username)
                        }
                    ));
                }
            }

            return Task.FromResult<ClaimsIdentity>(null);
        }
    }
}