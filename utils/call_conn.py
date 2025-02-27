import settings
import pyodbc

try:
    db_conn = settings.db_conn(0, "5s")
    conn = pyodbc.connect(db_conn)
except Exception as e:
    print(e)
    print("Falha de ligacao à BD 5s")
