# Generated by Django 5.0.1 on 2024-11-09 15:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_user_activity_score'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user_activity',
            name='score',
            field=models.FloatField(),
        ),
    ]
