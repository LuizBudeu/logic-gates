from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import IntegrityError
from rest_framework.exceptions import ParseError

import jwt
import json
from ..models import User

@api_view(['POST'])
def create(request):

  data = json.loads(request.body)

  user = None
  try: 
    user = User.objects.create(
      name = data['name'],
      email = data['email'],
      password = data['password'],
    )
  except IntegrityError:
    raise ParseError("Email já está em uso. Por favor, escolha um email diferente.")

  encoded_jwt = jwt.encode({"some": "payload"}, str(user.id), algorithm="HS256")

  return Response({
    'detail': 'ok',
    'token': encoded_jwt
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

  encoded_jwt = jwt.encode({"some": "payload"}, str(user.id), algorithm="HS256")

  return Response({
    'detail': 'ok',
    'token': encoded_jwt
  })