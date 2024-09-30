import os
from models.users import Users
from utils.db import db
from datetime import datetime

def gerar_dump_usuarios(pasta='backups'):

    os.makedirs(pasta, exist_ok=True)
    usuarios = Users.query.all()

    filename_base = 'banco_dados.sql'
    filename = os.path.join(pasta, filename_base)

    if os.path.exists(filename):
        novo_nome = os.path.join(pasta, f'banco_dados_{datetime.now().strftime("%Y%m%d_%H%M%S")}.sql')
        os.rename(filename, novo_nome)
    
    with open(filename, 'w', encoding='utf-8') as f:
        # Metadata: informações sobre a estrutura do banco de dados, incluindo todas as tabelas e suas colunas.
        # Sorted_tables: É uma lista de todas as tabelas registradas no metadata, ordenadas pelo nome
        for table in db.metadata.sorted_tables:
            f.write(f"-- Tabela: {table.name}\n")
            f.write(str(table.compile(db.get_engine())))
            print(db.metadata.sorted_tables)

        for usuario in usuarios:
            nascimento = usuario.nascimento.strftime('%Y-%m-%d') if usuario.nascimento else 'NULL'
            sql_query = f"INSERT INTO Users (email, senha, tipo_conta, nome, usuario, nascimento) VALUES ('{usuario.email}', '{usuario.senha}', '{usuario.tipo_conta}', '{usuario.nome}', '{usuario.usuario}', {nascimento};"

            f.write(sql_query + '\n')