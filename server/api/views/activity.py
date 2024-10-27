from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import IntegrityError
from django.db.models import Exists, OuterRef
from rest_framework.exceptions import ParseError

import jwt
import json
from ..models import Activity, User_Activity

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