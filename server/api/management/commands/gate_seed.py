from django.core.management.base import BaseCommand

class Command(BaseCommand):
    def handle(self, **options):
        from api.models import Gate
        import csv

        with open(r'C:\Users\itigo\Documents\VscodePessoal\logic-gates\server\api\gates.csv') as f:
            reader = csv.reader(f)
            for row in reader:
                _, created = Gate.objects.get_or_create(
                    id=100 + int(row[0]),
                    name=row[1],
                    circuit_json=row[2],
                    function_order=row[3],
                    hidden=row[4],
                    created_at=row[5],
                    updated_at=row[6],
                    user_id=row[7]
                    )