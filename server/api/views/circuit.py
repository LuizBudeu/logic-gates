from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import IntegrityError
from django.db.models import Exists, OuterRef
from rest_framework.exceptions import ParseError

import jwt
import json
from ..models import Gate

NandGate = {
    'name': "NAND",
    'logic': """function NAND() \{
        this.lastOutput = \{\};
        this.compute = function (input0, input1) {
            let output = {
                output0: !(input0 && input1),
            };
            this.lastOutput = output;
            return output;
        };
    }
    
    //module.exports = NAND;
    new NAND();""",
    'order': 0,
    'ios': {
        'inputs': 2,
        'outputs': 1
    },
}

@api_view(['GET'])
def listCircuits(request):
  token = request.headers.get('Authorization')

  if(token != ""):
    token = token.split(" ",1)[1]

    user_id = jwt.decode(token, options={"verify_signature": False})['user_id']

    saved_gates = Gate.objects.filter(
        user_id=user_id
    ).order_by('function_order').values()

    accumulated_code = NandGate["logic"] + "\n"
    logic_functions = [NandGate]
    func_str = ""

    for saved_gate in saved_gates:
      accumulated_code += saved_gate["function_string"] + "\n"
      
      func_str = accumulated_code + f"new {saved_gate['name']}()"

      if not saved_gate["hidden"]:
        logic_functions.append({
          "id": saved_gate["id"],
          "name": saved_gate["name"],
          "logic": func_str,
          "order": saved_gate["function_order"],
          "ios": {
            "inputs": saved_gate["inputs"],
            "outputs": saved_gate["outputs"]
          }
        })

    return Response(logic_functions)
  else:
      return Response("Token inválido", 401)