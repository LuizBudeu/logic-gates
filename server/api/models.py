from django.db import models

class User(models.Model):
  ROLES_CHOICES = [
    (0, "Estudante"),
    (1, "Professor")
  ]

  email = models.CharField(max_length=100, unique=True)
  password = models.CharField(max_length=100)
  name = models.CharField(max_length=100)
  role = models.IntegerField(choices=ROLES_CHOICES)
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

class Classroom(models.Model):
  proessor = models.ForeignKey(User, on_delete=models.CASCADE)
  name = models.CharField(max_length=100)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True) 

class Classroom_Student(models.Model):
  student = models.ForeignKey(User, on_delete=models.CASCADE)
  classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True) 

class Classroom_Activity(models.Model):
  STATUS_CHOICES = [
    (0, "Fechada"),
    (1, "Aberta"),
    (2, "Finalizada")
  ]

  classroom = models.ForeignKey(User, on_delete=models.CASCADE)
  activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
  status = models.IntegerField(choices=STATUS_CHOICES)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True) 