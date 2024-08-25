# Generated by Django 5.0.8 on 2024-08-25 21:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scoring', '0011_archivedscore'),
    ]

    operations = [
        migrations.AlterField(
            model_name='archivedscore',
            name='aggregation_method',
            field=models.CharField(choices=[('recency_weighted', 'Recency Weighted'), ('unweighted', 'Unweighted'), ('single_aggregation', 'Single Aggregation'), ('metaculus_prediction', 'Metaculus Prediction')], max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='leaderboardentry',
            name='aggregation_method',
            field=models.CharField(choices=[('recency_weighted', 'Recency Weighted'), ('unweighted', 'Unweighted'), ('single_aggregation', 'Single Aggregation'), ('metaculus_prediction', 'Metaculus Prediction')], max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='score',
            name='aggregation_method',
            field=models.CharField(choices=[('recency_weighted', 'Recency Weighted'), ('unweighted', 'Unweighted'), ('single_aggregation', 'Single Aggregation'), ('metaculus_prediction', 'Metaculus Prediction')], max_length=200, null=True),
        ),
    ]
