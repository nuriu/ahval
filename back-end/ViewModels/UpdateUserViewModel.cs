namespace Ahval.ViewModels
{
    public class UpdateUserViewModel
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public string NewEmailAddress { get; set; }
        public string GitHubKey { get; set; }
        public string GitLabKey { get; set; }
    }
}