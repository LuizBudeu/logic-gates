# Generated by Django 5.0.1 on 2024-10-28 19:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_user_role_classroom_classroom_activity_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='classroom',
            old_name='proessor',
            new_name='professor',
        ),
    ]
