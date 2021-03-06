﻿// <auto-generated />
using Ahval.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using System;

namespace backend.Migrations
{
    [DbContext(typeof(AhvalDbContext))]
    [Migration("20170908221642_ModelsUpdated")]
    partial class ModelsUpdated
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "2.0.0-rtm-26452");

            modelBuilder.Entity("Ahval.Models.Component", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<Guid?>("StateId");

                    b.Property<DateTime>("UpdatedAt");

                    b.HasKey("Id");

                    b.HasAlternateKey("Name");

                    b.HasIndex("StateId");

                    b.ToTable("Components");
                });

            modelBuilder.Entity("Ahval.Models.State", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(25);

                    b.HasKey("Id");

                    b.HasAlternateKey("Name");

                    b.ToTable("States");
                });

            modelBuilder.Entity("Ahval.Models.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("EmailAddress")
                        .HasMaxLength(64);

                    b.Property<DateTime>("LastLoggedInAt");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(255);

                    b.Property<DateTime>("RegisteredAt");

                    b.Property<byte[]>("Salt")
                        .IsRequired()
                        .HasMaxLength(255);

                    b.Property<Guid?>("StateId");

                    b.Property<DateTime>("UpdatedAt");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(25);

                    b.HasKey("Id");

                    b.HasAlternateKey("Username");

                    b.HasIndex("StateId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Ahval.Models.UserComponent", b =>
                {
                    b.Property<Guid>("User_Id");

                    b.Property<Guid>("Component_Id");

                    b.Property<string>("AccessToken");

                    b.HasKey("User_Id", "Component_Id");

                    b.HasIndex("Component_Id");

                    b.ToTable("UserComponent");
                });

            modelBuilder.Entity("Ahval.Models.Component", b =>
                {
                    b.HasOne("Ahval.Models.State", "State")
                        .WithMany()
                        .HasForeignKey("StateId");
                });

            modelBuilder.Entity("Ahval.Models.User", b =>
                {
                    b.HasOne("Ahval.Models.State", "State")
                        .WithMany()
                        .HasForeignKey("StateId");
                });

            modelBuilder.Entity("Ahval.Models.UserComponent", b =>
                {
                    b.HasOne("Ahval.Models.Component", "Component")
                        .WithMany("ComponentUsers")
                        .HasForeignKey("Component_Id")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Ahval.Models.User", "User")
                        .WithMany("UserComponents")
                        .HasForeignKey("User_Id")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
