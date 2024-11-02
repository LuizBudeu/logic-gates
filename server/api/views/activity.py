from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import IntegrityError
from django.db.models import Exists, OuterRef
from rest_framework.exceptions import ParseError
import pytz
from datetime import datetime

import jwt
import json
from ..models import Activity, User_Activity, User, Classroom, Classroom_Activity

@api_view(['GET'])
def listActivities(request):
  token = request.headers.get('Authorization')

  if(token != ""):
    token = token.split(" ",1)[1]

    user_id = jwt.decode(token, options={"verify_signature": False})['user_id']

    activities = Activity.objects.annotate(
        checked=Exists(
            User_Activity.objects.filter(activity_id=OuterRef('id'), user_id=user_id)
        )
    ).order_by('order').values('id', 'name', 'order', 'description_url', 'solution_url', 'checked')
        
    return Response(activities)
  else:
      return Response("Token inválido", 401)
  
@api_view(['POST'])
def saveActivity(request):
  token = request.headers.get('Authorization')

  if(token != ""):
    token = token.split(" ",1)[1]

    user_id = jwt.decode(token, options={"verify_signature": False})['user_id']

    try: 
      user = User.objects.get(
        id = user_id
      )
    except User.DoesNotExist:
      raise ParseError("Usuário não foi encontrado.")

    if(user.role != 1):
      return Response("Usuário não tem acesso", 401)

    data = json.loads(request.body)

    dataActivity = data.get('activity')

    try: 
      activity = Activity.objects.get(
        id = dataActivity.get('id')
      )
    except Activity.DoesNotExist:
      raise ParseError("Atividade não foi encontrada.")
    
    try: 
      classroom = Classroom.objects.get(
        professor = user,
        id = data.get('classroomId')
      )
    except Classroom.DoesNotExist:
      raise ParseError("Turma não foi encontrada.")

    try: 
      classroom_activity = Classroom_Activity.objects.get(
        activity = activity,
        classroom = classroom
      )
      classroom_activity.starts_at = dataActivity.get('starts_at')
      classroom_activity.ends_at = dataActivity.get('ends_at')
      classroom_activity.save()
    except Classroom_Activity.DoesNotExist:
      classroom_activity = Classroom_Activity.objects.create(
        activity = activity,
        classroom = classroom,
        starts_at = dataActivity.get('starts_at'),
        ends_at = dataActivity.get('ends_at')
      )

    return Response({
      'detail': 'ok'
    })
  else:
    return Response("Token inválido", 401)