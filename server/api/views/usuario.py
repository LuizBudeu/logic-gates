from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import IntegrityError
from rest_framework.exceptions import ParseError
import datetime
import jwt
import json
from ..models import User, Classroom, Classroom_Student

SECRET_KEY = "sua_chave_secreta_super_segura"

@api_view(['POST'])
def create(request):

  data = json.loads(request.body)

  user = None

  if data['role'] == '0' and data['classroomIdentification'] != '':
    try: 
      classroom = Classroom.objects.get(
        identification = data['classroomIdentification']
      )
    except Classroom.DoesNotExist:
      raise ParseError(f"Turma com identificador '{data['classroomIdentification']}' não foi encontrada")
    
  try: 
    user = User.objects.create(
      name = data['name'],
      email = data['email'],
      password = data['password'],
      role = data['role'],
    )
  except IntegrityError:
    raise ParseError("Email já está em uso. Por favor, escolha um email diferente.")
  
  if(data['role'] == '0' and data['classroomIdentification'] != '' and classroom):
    Classroom_Student.objects.create(
      classroom = classroom,
      student = user,
    )


  payload = {
      'user_id': user.id,
      'username': user.email,
      'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # expira em 1 hora
  }

  encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

  return Response({
    'detail': 'ok',
    'token': encoded_jwt,
    'role': user.role
  })

@api_view(['POST'])
def login(request):
  data = json.loads(request.body)

  user = None
  try: 
    user = User.objects.get(
      email = data['email'],
      password = data['password'],
    )
  except User.DoesNotExist:
    raise ParseError("Usuário não foi encontrado.")

  payload = {
    'user_id': user.id,
    'username': user.email,
    'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # expira em 1 hora
  }

  encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

  return Response({
    'detail': 'ok',
    'token': encoded_jwt,
    'role': user.role
  })

@api_view(['GET'])
def user(request):
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

      resp = {
        'name': user.name,
        'email': user.email,
        'role': user.role
      }
          
      return Response(resp)
  else:
      return Response("Token inválido", 401)