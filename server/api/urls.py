from django.urls import path, include

from .views.usuario import create as create_user

urlpatterns = [
  path('register', create_user, name='register_user'),
]