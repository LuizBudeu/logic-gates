from django.urls import path, include

from .views.usuario import create as create_user
from .views.usuario import login

urlpatterns = [
  path('register', create_user, name='register_user'),
  path('login', login, name='login'),
]