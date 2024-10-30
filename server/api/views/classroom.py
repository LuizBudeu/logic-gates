from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import IntegrityError
from django.db.models import Exists, OuterRef, F, Q, Count
from rest_framework.exceptions import ParseError

import jwt
import json
from ..models import User, Classroom, Classroom_Student, Classroom_Activity, Activity

@api_view(['GET'])
def listClassrooms(request):
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

    classrooms = Classroom.objects.annotate(
      numStudents = Count('classroom_student__id')
    ).filter(
      professor = user
    ).values()
        
    return Response(classrooms)
  else:
    return Response("Token inválido", 401)

@api_view(['GET'])
def classroomInfo(request, classroom_id):
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

    try: 
      classroom = Classroom.objects.get(
        professor = user,
        id = classroom_id
      )
    except Classroom.DoesNotExist:
      raise ParseError(f"Turma com id={classroom_id} não foi encontrada")

    resp = {
      'name': classroom.name,
    }
        
    return Response(resp)
  else:
    return Response("Token inválido", 401)

@api_view(['POST'])
def saveClassroom(request):
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

    print(data)

    if(data.get('id')):
      try:
        classroom = Classroom.objects.get(
          professor = user,
          id = data.get('id')
        )
        classroom.name = data.get('name')
        classroom.save()
      except Classroom.DoesNotExist:
        raise ParseError(f"Turma com id={body.get('id')} não foi encontrada")
    else:
      classroom = Classroom.objects.create(
        professor = user,
        id = data.get('id'),
        name = data.get('name')
      )
        
    return Response({
      'detail': 'ok'
    })
  else:
    return Response("Token inválido", 401)

@api_view(['GET'])
def classroomDetails(request, classroom_id):
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

    try: 
      classroom = Classroom.objects.get(
        professor = user,
        id = classroom_id
      )
    except Classroom.DoesNotExist:
      raise ParseError(f"Turma com id={classroom_id} não foi encontrada")

    students = Classroom_Student.objects.filter(
      classroom = classroom
    ).values('student_id', 'student__name')
       
    activities = Activity.objects.annotate(
      status=F('classroom_activity__status')
    ).filter(
      Q(classroom_activity__id__isnull=True) | Q(classroom_activity__id=1)
    ).order_by('order').values('id', 'name', 'order', 'description_url', 'solution_url', 'status')

    resp = {
      'classroom': {
        'name': classroom.name,
      },
      'students': students,
      'activities': activities
    }
        
    return Response(resp)
  else:
    return Response("Token inválido", 401)