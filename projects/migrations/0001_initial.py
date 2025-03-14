# Generated by Django 5.1.7 on 2025-03-09 13:08

import ckeditor.fields
import django.db.models.deletion
import taggit.managers
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        (
            "taggit",
            "0006_rename_taggeditem_content_type_object_id_taggit_tagg_content_8fc721_idx",
        ),
    ]

    operations = [
        migrations.CreateModel(
            name="AITool",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("description", models.TextField(blank=True)),
                ("website", models.URLField(blank=True)),
            ],
            options={
                "ordering": ["name"],
            },
        ),
        migrations.CreateModel(
            name="Project",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=200)),
                ("slug", models.SlugField(max_length=200, unique=True)),
                ("description", models.TextField()),
                ("content", ckeditor.fields.RichTextField()),
                (
                    "featured_image",
                    models.ImageField(blank=True, upload_to="projects/%Y/%m/%d/"),
                ),
                ("created_date", models.DateField(auto_now_add=True)),
                ("updated_date", models.DateTimeField(auto_now=True)),
                ("is_featured", models.BooleanField(default=False)),
                (
                    "human_contribution",
                    models.TextField(
                        help_text="Describe your contribution to the project"
                    ),
                ),
                (
                    "ai_contribution",
                    models.TextField(
                        help_text="Describe the AI's contribution to the project"
                    ),
                ),
                (
                    "github_link",
                    models.URLField(blank=True, help_text="Link to GitHub repository"),
                ),
                (
                    "live_link",
                    models.URLField(blank=True, help_text="Link to live demo"),
                ),
                (
                    "challenges",
                    models.TextField(
                        blank=True, help_text="Challenges faced during development"
                    ),
                ),
                (
                    "learnings",
                    models.TextField(
                        blank=True, help_text="What you learned from this project"
                    ),
                ),
                (
                    "ai_tools",
                    models.ManyToManyField(
                        related_name="projects", to="projects.aitool"
                    ),
                ),
                (
                    "technologies",
                    taggit.managers.TaggableManager(
                        help_text="Technologies used in the project",
                        through="taggit.TaggedItem",
                        to="taggit.Tag",
                        verbose_name="Tags",
                    ),
                ),
            ],
            options={
                "ordering": ["-created_date"],
            },
        ),
        migrations.CreateModel(
            name="ProjectImage",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("image", models.ImageField(upload_to="projects/gallery/%Y/%m/%d/")),
                ("caption", models.CharField(blank=True, max_length=200)),
                ("order", models.PositiveIntegerField(default=0)),
                (
                    "project",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="images",
                        to="projects.project",
                    ),
                ),
            ],
            options={
                "ordering": ["order"],
            },
        ),
    ]
