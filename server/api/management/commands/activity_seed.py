from django.core.management.base import BaseCommand

class Command(BaseCommand):
    def handle(self, **options):
        from api.models import Activity
        import json

        """Combinatórios:
            NAND
            NOT
            AND
            OR
            NOR
            XOR
            ONEBITADDER
            FOURBITADDER
            MUX
            ANDUNIT
            ORUNIT
            ARITUNIT
            ALU

        Sequenciais:
            SRLTACH
            DLATCH
            DFLIPFLOP (tem clock)
            COUNTER
            REGISTER

        Memória:
            ROM
            RAM
        """
        activities = [
            'NOT',
            'AND',
            'OR',
            'NOR',
            'XOR',
            'HALFADDER',
            'FULLADDER',
            'FOURBITADDER',
            'MUX4X1',
            'DMUX1X4',
            'ENCODER4X2',
            'DECODER2X4',
            'ALU',
            'SRLATCH',
            'DLATCH',
            'DFLIPFLOP',
            'REGISTER',
            'COUNTER',
            'ROM',
            'RAM'
        ]

        types = {
            'NOT': 'combinatorial',
            'AND': 'combinatorial',
            'OR': 'combinatorial',
            'NOR': 'combinatorial',
            'XOR': 'combinatorial',
            'HALFADDER': 'combinatorial',
            'FULLADDER': 'combinatorial',
            'FOURBITADDER': 'combinatorial',
            'MUX4X1': 'combinatorial',
            'DMUX1X4': 'combinatorial',
            'ENCODER4X2': 'combinatorial',
            'DECODER2X4': 'combinatorial',
            'ALU': 'combinatorial',
            'SRLATCH': 'sequential',
            'DLATCH': 'sequential',
            'DFLIPFLOP': 'sequential',
            'REGISTER': 'sequential',
            'COUNTER': 'sequential',
            'ROM': 'memory',
            'RAM': 'memory'
        }

        tbs = {
            'NOT': [
          {"in0":  0, "out0": 1},
          {"in0":  1, "out0": 0}
        ],
            'AND': [
          {"in0":  0, "in1":  0, "out0": 0},
          {"in0":  0, "in1":  1, "out0": 0},
          {"in0":  1, "in1":  0, "out0": 0},
          {"in0":  1, "in1":  1, "out0": 1}
         ],
            'OR': [
                {"in0": 0, "in1": 0, "out0": 0},
                {"in0": 0, "in1": 1, "out0": 1},
                {"in0": 1, "in1": 0, "out0": 1},
                {"in0": 1, "in1": 1, "out0": 1}
            ],
            'NOR': [
          {"in0":  0, "in1":  0, "out0": 1},
          {"in0":  0, "in1":  1, "out0": 0},
          {"in0":  1, "in1":  0, "out0": 0},
          {"in0":  1, "in1":  1, "out0": 0}
        ],
            'XOR': [
                {"in0": 0, "in1": 0, "out0": 0},
                {"in0": 0, "in1": 1, "out0": 1},
                {"in0": 1, "in1": 0, "out0": 1},
                {"in0": 1, "in1": 1, "out0": 0}
            ],
            'HALFADDER': [
                {"in0": 0, "in1": 0, "out0": 0, "out1": 0},  # out0=carry-out, out1=soma
                {"in0": 0, "in1": 1, "out0": 0, "out1": 1},
                {"in0": 1, "in1": 0, "out0": 0, "out1": 1},
                {"in0": 1, "in1": 1, "out0": 1, "out1": 0}
            ],
            'FULLADDER': [
  {
    "in0": 0,
    "in1": 0,
    "in2": 0,
    "out0": 0,
    "out1": 0
  },
  {
    "in0": 0,
    "in1": 1,
    "in2": 0,
    "out0": 1,
    "out1": 0
  },
  {
    "in0": 1,
    "in1": 0,
    "in2": 0,
    "out0": 1,
    "out1": 0
  },
  {
    "in0": 1,
    "in1": 1,
    "in2": 0,
    "out0": 0,
    "out1": 1
  },
  {
    "in0": 0,
    "in1": 0,
    "in2": 1,
    "out0": 1,
    "out1": 0
  },
  {
    "in0": 1,
    "in1": 0,
    "in2": 1,
    "out0": 0,
    "out1": 1
  },
  {
    "in0": 0,
    "in1": 1,
    "in2": 1,
    "out0": 0,
    "out1": 1
  },
  {
    "in0": 1,
    "in1": 1,
    "in2": 1,
    "out0": 1,
    "out1": 1
  }
],
            'FOURBITADDER': [
                {"in0": 0, "in1": 0, "in2": 0, "in3": 0, "in4": 0, "in5": 0, "in6": 0, "in7": 0, "in8": 0, "out0": 0,
                 "out1": 0, "out2": 0, "out3": 0, "out4": 0},
                {"in0": 0, "in1": 0, "in2": 0, "in3": 0, "in4": 0, "in5": 0, "in6": 0, "in7": 0, "in8": 1, "out0": 1,
                 "out1": 0, "out2": 0, "out3": 0, "out4": 0},
                {"in0": 1, "in1": 0, "in2": 0, "in3": 0, "in4": 1, "in5": 0, "in6": 0, "in7": 0, "in8": 0, "out0": 0,
                 "out1": 1, "out2": 0, "out3": 0, "out4": 0},
                {"in0": 1, "in1": 0, "in2": 0, "in3": 0, "in4": 1, "in5": 0, "in6": 0, "in7": 0, "in8": 1, "out0": 1,
                 "out1": 1, "out2": 0, "out3": 0, "out4": 0},
                {"in0": 0, "in1": 1, "in2": 0, "in3": 0, "in4": 0, "in5": 1, "in6": 0, "in7": 0, "in8": 0, "out0": 0,
                 "out1": 0, "out2": 1, "out3": 0, "out4": 0},
                {"in0": 1, "in1": 1, "in2": 1, "in3": 1, "in4": 1, "in5": 1, "in6": 1, "in7": 1, "in8": 0, "out0": 0,
                 "out1": 1, "out2": 1, "out3": 1, "out4": 1},
                {"in0": 1, "in1": 1, "in2": 1, "in3": 1, "in4": 1, "in5": 1, "in6": 1, "in7": 1, "in8": 1, "out0": 1,
                 "out1": 1, "out2": 1, "out3": 1, "out4": 1}
            ],
            'MUX4X1': [

            ],
            'DMUX1X4': [

            ],
            'ENCODER4X2': [

            ],
            'DECODER2X4': [

            ],
            'ALU': [

            ],
            'SRLATCH': [

            ],
            'DLATCH': [

            ],
            'DFLIPFLOP': [

            ],
            'REGISTER': [

            ],
            'COUNTER': [

            ],
            'ROM': [

            ],
            'RAM': [

            ]
        }


        i = 4
        skip = 4
        for activity in activities[skip:]:
            Activity.objects.get_or_create(
                name=activity,
                order=i,
                description_url=f"./docs#{types[activity]}-circuits-{activity.lower()}",
                solution_image=f"{activity}.PNG",
                testbench=json.dumps(tbs[activity]))

            i += 1



