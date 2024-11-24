from ..models import Gate
import json


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


def get_saved_gates_logics(user_id, should_instantiate_in_the_end=True):
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

        ios = get_ios_from_circuit(circuit)

        accumulated_code += logic_function_string + "\n"

        func_str = accumulated_code
        if should_instantiate_in_the_end:
            func_str += f"new {saved_gate['name']}()"

        logic_functions.append({
            "id": saved_gate["id"],
            "name": saved_gate["name"],
            "logic": func_str,
            "order": saved_gate["function_order"],
            "ios": ios
        })

    return logic_functions


def get_ios_from_circuit(circuit):
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
    return ios


def generate_logic_function_string(circuit, new_gate_name):
    components = circuit["components"]
    connections = circuit["connections"]

    global_outputs = [comp for comp in components if comp["type"] == "output" and comp["isGlobal"]]
    global_inputs = [comp for comp in components if comp["type"] == "input" and comp["isGlobal"]]
    gates = [comp for comp in components if comp["type"] == "gate"]

    # Write function name
    logic_function_string = f"function {new_gate_name} () {{\n"

    # Write instantiation of lastOutput
    logic_function_string += "this.lastOutput = {};\n"

    # Write compute function
    logic_function_string += "this.compute = function ("
    for i, global_input in enumerate(global_inputs):
        logic_function_string += f"input{global_input['IOId']}"
        if i < len(global_inputs) - 1:
            logic_function_string += ", "
    logic_function_string += ") {\n"

    # Write function's instantiation of gates
    for gate in gates:
        gate_obj_name = f"{gate['name']}{gate['circuitId']}"
        logic_function_string += f"if (this.{gate_obj_name} === undefined) {{\nthis.{gate_obj_name} = new {gate['name']}();\n}}\n"

    # Get return object
    output_obj = {}

    def get_upstream_component(upstream_connection):
        upstream_circuit_id = upstream_connection["upstream"]
        if "_" in upstream_connection["upstream"]:
            upstream_circuit_id = upstream_connection["upstream"].split("_")[0]
        upstream_component = next(comp for comp in components if comp["circuitId"] == upstream_circuit_id)
        return upstream_component

    def get_upstream_logic(upstream_component, output_io_id, memo=None):
        if memo is None:
            memo = set()

        memo_key = f"{upstream_component['circuitId']}_{output_io_id}"

        # If the component has already been memoized, return the last output
        if memo_key in memo:
            return f"this.{upstream_component['name']}{upstream_component['circuitId']}.lastOutput?.{output_io_id}"

        memo.add(memo_key)

        if upstream_component["type"] == "input" and upstream_component["isGlobal"]:
            logic_string = f"input{upstream_component['IOId']}"
        elif upstream_component["type"] == "gate":
            logic_string = f"this.{upstream_component['name']}{upstream_component['circuitId']}.compute("

            gate_inputs = upstream_component["inputs"]

            for i, input_data in enumerate(gate_inputs):
                upstream_connection = next(
                    conn for conn in connections
                    if conn["downstream"] == f"{upstream_component['circuitId']}_input{input_data['IOId']}"
                )

                up_component = get_upstream_component(upstream_connection)

                if up_component["type"] == "input" and up_component["isGlobal"]:
                    logic_string += f"input{up_component['IOId']}"
                elif up_component["type"] == "gate":
                    logic_string += get_upstream_logic(
                        up_component,
                        upstream_connection["upstream"].split("_")[1],
                        memo
                    )
                else:
                    raise ValueError("Invalid upstream component type")

                if i < len(gate_inputs) - 1:
                    logic_string += ", "

            logic_string += f").{output_io_id}"
        else:
            raise ValueError("Invalid upstream component type")

        return logic_string

    for global_output in global_outputs:
        output_name = f"output{global_output['IOId']}"
        output_obj[output_name] = ""

        upstream_connection = next(
            conn for conn in connections
            if conn["downstream"] == global_output["circuitId"]
        )
        upstream_component = get_upstream_component(upstream_connection)

        output_obj[output_name] += get_upstream_logic(
            upstream_component,
            upstream_connection["upstream"].split("_")[1]
        )

    # Write output object
    logic_function_string += "let output = {\n"
    for i, (output, value) in enumerate(output_obj.items()):
        logic_function_string += f"{output}: {value}"
        if i < len(output_obj) - 1:
            logic_function_string += ",\n"
    logic_function_string += "\n};"

    # Write lastOutput
    logic_function_string += "\nthis.lastOutput = output;"

    # Write return statement
    logic_function_string += "\nreturn output;\n};\n}"

    return logic_function_string
