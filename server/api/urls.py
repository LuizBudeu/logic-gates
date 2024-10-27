from django.urls import path, include

from .views.usuario import create as create_user
from .views.usuario import login
from .views.usuario import user
from .views.activity import listActivities
from .views.circuit import listCircuits

urlpatterns = [
  path('register', create_user, name='register_user'),
  path('login', login, name='login'),
  path('userInfo', user, name='userInfo'),
  path('listActivities', listActivities, name='listActivities'),
  path('listCircuits', listCircuits, name='listCircuits')
]