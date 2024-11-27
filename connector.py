import psycopg2

# Configurações da conexão
DATABASE = 'certificados'
USER = 'postgres'
PASSWORD = 'sua_senha'
HOST = 'localhost'
PORT = 5432

# Estabelece a conexão
conn = psycopg2.connect(
    database=DATABASE,
    user=USER,
    password=PASSWORD,
    host=HOST,
    port=PORT
)

# Cria um cursor para executar consultas
cursor = conn.cursor()

# Executa uma consulta
cursor.execute("SELECT * FROM professores;")

# Recupera os resultados
rows = cursor.fetchall()

# Imprime os resultados
for row in rows:
    print(row)

# Fecha o cursor e a conexão
cursor.close()
conn.close()