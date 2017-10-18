﻿// <auto-generated />
using Ajanda.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using System;

namespace backend.Migrations
{
    [DbContext(typeof(AjandaDbContext))]
    partial class AjandaDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "2.0.0-rtm-26452");

            modelBuilder.Entity("Ajanda.Models.Component", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<Guid>("StateId");

                    b.Property<DateTime>("UpdatedAt");

                    b.HasKey("Id");

                    b.HasAlternateKey("Name");

                    b.HasIndex("StateId");

                    b.ToTable("Components");
                });

            modelBuilder.Entity("Ajanda.Models.Issue", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid>("ComponentId");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(25);

                    b.Property<int>("Number");

                    b.Property<string>("RepoIdentifier")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("ComponentId");

                    b.ToTable("Issues");
                });

            modelBuilder.Entity("Ajanda.Models.Note", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Body")
                        .IsRequired()
                        .HasMaxLength(250);

                    b.HasKey("Id");

                    b.ToTable("Notes");
                });

            modelBuilder.Entity("Ajanda.Models.State", b =>
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

            modelBuilder.Entity("Ajanda.Models.User", b =>
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

                    b.Property<Guid>("StateId");

                    b.Property<DateTime>("UpdatedAt");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(25);

                    b.HasKey("Id");

                    b.HasAlternateKey("Username");

                    b.HasIndex("StateId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Ajanda.Models.UserComponents", b =>
                {
                    b.Property<Guid>("User_Id");

                    b.Property<Guid>("Component_Id");

                    b.Property<string>("AccessToken");

                    b.HasKey("User_Id", "Component_Id");

                    b.HasIndex("Component_Id");

                    b.ToTable("UserComponents");
                });

            modelBuilder.Entity("Ajanda.Models.UserWeeklyItem", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Date")
                        .IsRequired()
                        .HasMaxLength(10);

                    b.Property<Guid>("Item_Id");

                    b.Property<Guid>("TypeId");

                    b.Property<DateTime>("UpdatedAt");

                    b.Property<Guid>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("TypeId");

                    b.HasIndex("UserId");

                    b.ToTable("UserWeeklyItems");
                });

            modelBuilder.Entity("Ajanda.Models.WeeklyItemType", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(25);

                    b.HasKey("Id");

                    b.ToTable("WeeklyItemTypes");
                });

            modelBuilder.Entity("Ajanda.Models.Component", b =>
                {
                    b.HasOne("Ajanda.Models.State", "State")
                        .WithMany()
                        .HasForeignKey("StateId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Ajanda.Models.Issue", b =>
                {
                    b.HasOne("Ajanda.Models.Component", "Component")
                        .WithMany()
                        .HasForeignKey("ComponentId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Ajanda.Models.User", b =>
                {
                    b.HasOne("Ajanda.Models.State", "State")
                        .WithMany()
                        .HasForeignKey("StateId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Ajanda.Models.UserComponents", b =>
                {
                    b.HasOne("Ajanda.Models.Component", "Component")
                        .WithMany("ComponentUsers")
                        .HasForeignKey("Component_Id")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Ajanda.Models.User", "User")
                        .WithMany("UserComponents")
                        .HasForeignKey("User_Id")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Ajanda.Models.UserWeeklyItem", b =>
                {
                    b.HasOne("Ajanda.Models.WeeklyItemType", "Type")
                        .WithMany()
                        .HasForeignKey("TypeId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Ajanda.Models.User", "User")
                        .WithMany("WeeklyItems")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
