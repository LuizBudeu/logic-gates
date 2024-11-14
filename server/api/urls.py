from django.urls import path, include

from .views.usuario import create as create_user
from .views.usuario import login
from .views.usuario import user
from .views.activity import listActivities
from .views.activity import saveActivity
from .views.activity import activityDetails
from .views.activity import activitySolution
from .views.circuit import listCircuits
from .views.circuit import saveCircuit
from .views.circuit import deleteCircuit
from .views.circuit import judgeCircuit
from .views.classroom import listClassrooms
from .views.classroom import classroomInfo
from .views.classroom import saveClassroom
from .views.classroom import classroomDetails
from .views.classroom import classroomStudentInfo

urlpatterns = [
  path('register', create_user, name='register_user'),
  path('login', login, name='login'),
  path('userInfo', user, name='userInfo'),
  path('listActivities', listActivities, name='listActivities'),
  path('saveActivity', saveActivity, name='saveActivity'),
  path('activityDetails/<int:classroom_id>/<int:activity_id>', activityDetails, name='activityDetails'),
  path('activitySolution/<int:activity_id>', activitySolution, name='activitySolution'),
  path('listCircuits', listCircuits, name='listCircuits'),
  path('saveCircuit', saveCircuit, name='saveCircuit'),
  path('deleteCircuit/<int:gate_id>', deleteCircuit, name='deleteCircuit'),
  path('judgeCircuit', judgeCircuit, name='judgeCircuit'),
  path('listClassrooms', listClassrooms, name='listClassrooms'),
  path('classroomInfo/<int:classroom_id>', classroomInfo, name='classroomInfo'),
  path('saveClassroom', saveClassroom, name='saveClassroom'),
  path('classroomDetails/<int:classroom_id>', classroomDetails, name='classroomDetails'),
  path('classroomStudentInfo', classroomStudentInfo, name='classroomStudentInfo'),
]