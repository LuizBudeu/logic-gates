import random
from rest_framework.decorators import api_view
from rest_framework.response import Response
# from django.db import IntegrityError
# from django.db.models import Exists, OuterRef
from rest_framework.exceptions import ParseError

import jwt
import json
from ..models import Gate, User, User_Activity, Activity
from ..utils.generate_logic_function_string import generate_logic_function_string

'''
ESTÁ CAGADO, ATUALIZAR COM NOVO CÓDIGO DO SERVER.JS
'''

NandGate = {
    'name': "NAND",
    'logic': """function NAND() {
        this.lastOutput = null;
        this.compute = function (input0, input1) {
            let output = {
                output0: !(input0 && input1),
            };
            this.lastOutput = output;
            return output;
        };
    }
    
    new NAND();""",
    'order': 0,
    'ios': {
        'inputs': [
            {'IOId': "0", 'IOLabel': "in0"},
            {'IOId': "1", 'IOLabel': "in1"},
        ],
        'outputs': [{'IOId': "0", 'IOLabel': "out0"}]
    },
}


# TODO
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

    # Get user saved gates
    saved_gates = Gate.objects.filter(
        user_id=user_id,
        hidden=0
    ).order_by('function_order').values()

    accumulated_code = NandGate["logic"] + "\n"
    logic_functions = [NandGate]

    # For each saved gate, grab circuit JSON and generate logic function string
    for saved_gate in saved_gates:
        circuit_json = saved_gate["circuit_json"]
        circuit = json.loads(circuit_json)
        logic_function_string = generate_logic_function_string(circuit, saved_gate['name'])

        # Get global IO labels and set inputs and outputs
        global_ios = [component for component in circuit["components"] if component.get("isGlobal")]
        ios = {
            "inputs": [],
            "outputs": [],
        }
        inputs = [io for io in global_ios if io["type"] == "input"]
        for input_io in inputs:
            ios["inputs"].append({
                "IOId": input_io["IOId"],
                "IOLabel": input_io["label"],
            })
        outputs = [io for io in global_ios if io["type"] == "output"]
        for output_io in outputs:
            ios["outputs"].append({
                "IOId": output_io["IOId"],
                "IOLabel": output_io["label"],
            })

        accumulated_code += logic_function_string + "\n"

        func_str = accumulated_code + f"new {saved_gate['name']}()"

        logic_functions.append({
            "id": saved_gate["id"],
            "name": saved_gate["name"],
            "logic": func_str,
            "order": saved_gate["function_order"],
            "ios": ios
        })

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
    print(data['circuit'])

    saved_gates = Gate.objects.filter(
        user_id=user_id,
        name=gateName,
        hidden=False
    ).values()

    if (len(saved_gates) != 0):
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

    if (token != ""):
        token = token.split(" ", 1)[1]

        user_id = jwt.decode(token, options={"verify_signature": False})['user_id']

        try:
            user = User.objects.get(
                id=user_id
            )
        except User.DoesNotExist:
            raise ParseError("Usuário não foi encontrado.")

        data = json.loads(request.body)
        activity_id = data['activity_id']
        circuit = json.loads(data['circuit'])

        try:
            activity = Activity.objects.get(
                id=activity_id
            )
        except Activity.DoesNotExist:
            raise ParseError("Atividade não foi encontrada.")

        # TODO: Process gate and generate score
        score = round(random.uniform(0, 10), 1)

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
    else:
        return Response("Token inválido", 401)


def generateGate(circuitJSON, newGateName):
    components = circuitJSON['components']
    connections = circuitJSON['connections']

    global_outputs = [component for component in components if component["type"] == "output" and component["isGlobal"]]
    global_inputs = [component for component in components if component["type"] == "input" and component["isGlobal"]]
    gates = [component for component in components if component["type"] == "gate"]

    # Write function name
    logicFunctionString = f"function {newGateName}() {{\n"

    # Write instantiation of lastOutput
    logicFunctionString += "this.lastOutput = {};\n"

    # Write compute function
    logicFunctionString += "this.compute = function ("
    for index, globalInput in enumerate(global_inputs):
        logicFunctionString += f"input{globalInput['IOId']}"
        if (index < len(global_inputs) - 1):
            logicFunctionString += ", "
    logicFunctionString += ") {\n"

    # Write function's instantiation of gates
    for gate in gates:
        gateObjName = f"{gate['name']}{gate['circuitId']}"
        logicFunctionString += f"if (this.{gateObjName} === undefined) {{\nthis.{gateObjName} = new {gate['name']}();\n}}\n"

    # Get return object
    outputObj = {}
    for globalOutput in global_outputs:
        outputName = f"output{globalOutput['IOId']}"
        outputObj[outputName] = ""

        upstreamConnection = next((conn for conn in connections if conn["downstream"] == globalOutput["circuitId"]),
                                  None)
        upstreamComponent = getUpstreamComponent(upstreamConnection, components)

        outputObj[outputName] += getUpstreamLogic(upstreamComponent, upstreamConnection['upstream'].split("_", 1)[1],
                                                  connections, components)

    # Write output object
    logicFunctionString += "let output = {\n"
    output_keys = list(outputObj.keys())

    for index, output in enumerate(output_keys):
        logicFunctionString += f"{output}: {outputObj[output]}"
        if index < len(output_keys) - 1:
            logicFunctionString += ",\n"
    logicFunctionString += "\n};"

    # Write lastOutput
    logicFunctionString += "\nthis.lastOutput = output;"

    # Write return statement
    logicFunctionString += "\nreturn output;\n};\n}"

    return {
        'logicFunctionString': logicFunctionString,
        'ios': {
            'inputs': len(global_inputs),
            'outputs': len(global_outputs),
        },
    }


# Helper function to get upstreamCircuitId
def getUpstreamComponent(upstreamConnection, components):
    upstreamCircuitId = upstreamConnection['upstream']
    if ("_" in upstreamCircuitId):
        upstreamCircuitId = upstreamCircuitId.split("_", 1)[0]
    upstreamComponent = next((component for component in components if component["circuitId"] == upstreamCircuitId),
                             None)
    return upstreamComponent


# Recursively get the logic string for a component with memoization
def getUpstreamLogic(upstreamComponent, outputIOId, connections, components, memo=set()):
    memoKey = f"{upstreamComponent['circuitId']}_{outputIOId}"

    # If the component has already been memoized, return the last output
    if (memoKey in memo):
        return f"this.{upstreamComponent['name']}{upstreamComponent['circuitId']}.lastOutput?.{outputIOId}"

    memo.add(memoKey)

    logicString = ""

    if (upstreamComponent["type"] == "input" and upstreamComponent["isGlobal"]):
        logicString = f"input{upstreamComponent['IOId']}"
    elif (upstreamComponent['type'] == "gate"):
        logicString = f"this.{upstreamComponent['name']}{upstreamComponent['circuitId']}.compute("

        gateInputs = upstreamComponent["inputs"]

        for index, input in enumerate(gateInputs):
            downstream_key = f"{upstreamComponent['circuitId']}_input{input['IOId']}"
            upstreamConnection = next((conn for conn in connections if conn['downstream'] == downstream_key), None)

            upComponent = getUpstreamComponent(upstreamConnection, components)

            if (upComponent["type"] == "input" and upComponent["isGlobal"]):
                logicString += f"input{upComponent['IOId']}"
            elif (upComponent["type"] == "gate"):
                logicString += getUpstreamLogic(upComponent, upstreamConnection['upstream'].split('_', 1)[1],
                                                connections, components, memo);
            else:
                raise ValueError("Invalid upstream component type")

            if (index < len(gateInputs) - 1):
                logicString += ", "

        logicString += f").{outputIOId}"
    else:
        raise ValueError("Invalid upstream component type")

    return logicString
