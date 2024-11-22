import random
from rest_framework.decorators import api_view
from rest_framework.response import Response
# from django.db import IntegrityError
# from django.db.models import Exists, OuterRef
from rest_framework.exceptions import ParseError

import jwt
import json
from ..models import Gate, User, User_Activity, Activity
from ..utils.gate_utils import get_saved_gates_logics, generate_logic_function_string, get_ios_from_circuit
import js2py



@api_view(['GET'])
def listCircuits(request):
    token = request.headers.get('Authorization')

    if token == "":
      return Response("Token inválido", 401)

    token = token.split(" ", 1)[1]
    user_id = jwt.decode(token, options={"verify_signature": False})['user_id']

    # Validate user
    try:
        user = User.objects.get(
            id=user_id
        )
    except User.DoesNotExist:
        raise ParseError("Usuário não foi encontrado.")

    logic_functions = get_saved_gates_logics(user_id)

    return Response(logic_functions)


@api_view(['POST'])
def saveCircuit(request):
    token = request.headers.get('Authorization')

    if token == "":
        return Response("Token inválido", 401)

    token = token.split(" ", 1)[1]

    user_id = jwt.decode(token, options={"verify_signature": False})['user_id']

    user = None
    try:
        user = User.objects.get(
            id=user_id
        )
    except User.DoesNotExist:
        raise ParseError("Usuário não foi encontrado.")

    data = json.loads(request.body)
    gateName = data['gateName']

    saved_gates = Gate.objects.filter(
        user_id=user_id,
        hidden=False
    ).values()

    if (any([saved_gate['name'] == gateName for saved_gate in saved_gates])):
        return Response({
            'gateName': gateName,
            'message': "Gate name already exists. Please choose a different name.",
        }, 301)

    # Save gate
    gate = Gate.objects.create(
        user=user,
        name=gateName,
        circuit_json=data['circuit'],
        function_order=len(saved_gates) + 1,
        hidden=False
    )

    return Response(data)


@api_view(['DELETE'])
def deleteCircuit(request, gate_id):
    token = request.headers.get('Authorization')

    if (token != ""):
        token = token.split(" ", 1)[1]

        user_id = jwt.decode(token, options={"verify_signature": False})['user_id']

        user = None
        try:
            user = User.objects.get(
                id=user_id
            )
        except User.DoesNotExist:
            raise ParseError("Usuário não foi encontrado.")

        try:
            gate = Gate.objects.get(
                user=user,
                id=gate_id
            )
            gate.hidden = True
            gate.save()
        except Gate.DoesNotExist:
            raise ParseError("Porta não foi encontrada.")

        return Response(gate_id)
    else:
        return Response("Token inválido", 401)


@api_view(['POST'])
def judgeCircuit(request):
    token = request.headers.get('Authorization')

    if token == "":
        return Response("Token inválido", 401)

    token = token.split(" ", 1)[1]

    user_id = jwt.decode(token, options={"verify_signature": False})['user_id']

    try:
        user = User.objects.get(
            id=user_id
        )
    except User.DoesNotExist:
        raise ParseError("Usuário não foi encontrado.")

    data = json.loads(request.body)
    circuit = json.loads(data['circuit'])
    activity_id = data['activity_id']

    if not circuit.get('components') or not circuit['connections']:
        return Response("Circuito não pode estar vazio para ser avaliado", 400)

    try:
        activity = Activity.objects.get(
            id=activity_id
        )
    except Activity.DoesNotExist:
        raise ParseError("Atividade não foi encontrada.")

    testbench = activity.testbench
    last_gate_logic = get_saved_gates_logics(user_id, False)[-1]
    last_logic_function = last_gate_logic['logic']
    circuit_to_test_function_string = generate_logic_function_string(circuit, 'JUDGE_TEST')

    js_to_test = last_logic_function + ';' + circuit_to_test_function_string + ';const tests = ' + testbench + ';'

    js_to_test += """const j = new JUDGE_TEST();

const points_per_test = 10 / tests.length

let total_points = 0;

let i = 0;
while (i < tests.length) {
    const test = tests[i];
    const inputs = [];
    const outs = {};

    for (const key in test) {
        if (test.hasOwnProperty(key)) {
            if (key.indexOf("in") === 0) {
                inputs.push(test[key])
            } else if (key.indexOf("out") === 0) {
                outs['output' + key.replace('out', '')] = !!test[key]
            }
        }
    }

    const results = j.compute.apply(this, inputs)

    for (const key in results) {
        if (results[key] === outs[key]) {
            total_points += points_per_test;
        }
    }
    i++;
}
total_points
"""

    score = js2py.eval_js(js_to_test)

    # Save score
    user_activity = User_Activity.objects.create(
        user=user,
        activity=activity,
        score=score,
    )

    return Response({
        'detail': 'ok',
        'score': score
    })
