from django.db import models

class User(models.Model):
  email = models.CharField(max_length=100)
  password = models.CharField(max_length=100)
  name = models.CharField(max_length=100)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

class Gate(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  name = models.CharField(max_length=100)
  function_string = models.TextField()
  function_order = models.IntegerField()
  inputs = models.IntegerField()
  outputs = models.IntegerField()
  hidden = models.BooleanField()
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True) 

class Activity(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  name = models.CharField(max_length=100)
  order = models.IntegerField()
  description_url = models.CharField(max_length=100)
  solution_url = models.CharField(max_length=100)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True) 

class User_Activity(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True) 
