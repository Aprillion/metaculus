# Generated by Django 5.0.6 on 2024-07-11 20:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("scoring", "0006_alter_leaderboard_edited_at_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="leaderboardentry",
            name="excluded",
            field=models.BooleanField(default=False),
        ),
    ]
