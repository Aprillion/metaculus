# Generated by Django 5.0.6 on 2024-07-26 17:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("posts", "0015_postsubscription_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="postsubscription",
            name="cp_threshold",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="postsubscription",
            name="comments_frequency",
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="postsubscription",
            name="last_sent_at",
            field=models.DateTimeField(blank=True, db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name="postsubscription",
            name="milestone_step",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="postsubscription",
            name="next_trigger_datetime",
            field=models.DateTimeField(blank=True, db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name="postsubscription",
            name="next_trigger_value",
            field=models.FloatField(blank=True, db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name="postsubscription",
            name="recurrence_interval",
            field=models.DurationField(blank=True, null=True),
        ),
    ]
