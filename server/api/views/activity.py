from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import IntegrityError
from django.db.models import Exists, OuterRef, Max, Q, F, Value, CharField
from rest_framework.exceptions import ParseError
import pytz
from datetime import datetime

import jwt
import json
from ..models import Activity, User_Activity, User, Classroom, Classroom_Activity, Classroom_Student

@api_view(['GET'])
def listActivities(request):
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
    
    try: 
      classroom = Classroom.objects.get(
        classroom_student__student = user
      )
      activities = Activity.objects.filter(
        Q(user_activity__id__isnull=False) | Q(classroom_activity__id__isnull=False),
        classroom_activity__classroom__classroom_student__classroom_id=F('classroom_activity__classroom_id'),
        classroom_activity__classroom__classroom_student__student=user
      ).annotate(
        starts_at=Max('classroom_activity__starts_at'),
        ends_at=Max('classroom_activity__ends_at'),
        score=Max('user_activity__score'),
      ).values(
        'id', 
        'name', 
        'order', 
        'description_url', 
        'solution_url', 
        'starts_at', 
        'ends_at', 
        'score'
      ).order_by('order')
    except Classroom.DoesNotExist:
      activities = Activity.objects.annotate(
        score=Max(
          'user_activity__score',
          filter=Q(user_activity__user=user)),
      ).values(
        'id', 
        'name', 
        'order', 
        'description_url', 
        'solution_url', 
        'score'
      ).order_by('order')

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
  
@api_view(['GET'])
def activityDetails(request, classroom_id, activity_id):
  token = request.headers.get('Authorization')

  if(token != ""):
    token = token.split(" ",1)[1]

    user_id = jwt.decode(token, options={"verify_signature": False})['user_id']

    print(user_id)

    try: 
      user = User.objects.get(
        id = user_id
      )
    except User.DoesNotExist:
      raise ParseError("Usuário não foi encontrado.")

    if(user.role != 1):
      return Response("Usuário não tem acesso", 401)

    try: 
      classroom = Classroom.objects.get(
        professor = user,
        id = classroom_id
      )
    except Classroom.DoesNotExist:
      raise ParseError(f"Turma com id={classroom_id} não foi encontrada")
    
    students = Classroom_Student.objects.annotate(
      name=F('student__name'),
      user_id=F('student_id'),
      max_score=Value(None, output_field=CharField()),
      scores=Value(None, output_field=CharField())
    ).filter(
      classroom=classroom,
    ).values('user_id', 'name', 'max_score', 'scores')

    # return Response(user_scores)
    
    user_scores = User_Activity.objects.annotate(
      name=F('user__name')
    ).filter(
      user__classroom_student__classroom=classroom,
      activity_id=activity_id
    ).values('user_id', 'score', 'created_at')

    # students = []

    for user_score in user_scores:
      score_student = None
      for student in students:
        if student['user_id'] == user_score['user_id']:
          print("i found it!")
          score_student = student
          break
      
      if(score_student):
        if(score_student['max_score'] == None or score_student['max_score'] < user_score['score']):
          score_student['max_score'] = user_score['score']
        
        if(score_student['scores'] == None):
          score_student['scores'] = []
        
        score_student['scores'].append({
          'score':user_score['score'],
          'created_at':user_score['created_at']
        })
      # else:
      #   students.append({
      #     'user_id': user_score['user_id'],
      #     'name':user_score['name'],
      #     'max_score':user_score['score'],
      #     'scores':[{
      #       'score':user_score['score'],
      #       'created_at':user_score['created_at']
      #     }]
      #   })
        
    return Response(students)
  else:
    return Response("Token inválido", 401)