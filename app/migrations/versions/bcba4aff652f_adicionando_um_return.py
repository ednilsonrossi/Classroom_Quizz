"""Adicionando um return

Revision ID: bcba4aff652f
Revises: 13ac14b11cc4
Create Date: 2025-04-10 05:54:49.290845

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'bcba4aff652f'
down_revision = '13ac14b11cc4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('relatorioGeral',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('jogador_id', sa.Integer(), nullable=True),
    sa.Column('quiz_id', sa.Integer(), nullable=False),
    sa.Column('jogador', sa.String(length=26), nullable=True),
    sa.Column('pontuacao_total', sa.Integer(), nullable=False),
    sa.Column('tempo_total', sa.Integer(), nullable=False),
    sa.Column('feedback', sa.String(length=250), nullable=False),
    sa.Column('ranking', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['jogador_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['quiz_id'], ['quiz.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('relatorioPerguntas',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('relatorio_id', sa.Integer(), nullable=False),
    sa.Column('perguntas_id', sa.Integer(), nullable=False),
    sa.Column('resposta', sa.String(length=300), nullable=False),
    sa.Column('correta', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['perguntas_id'], ['perguntas_quiz.id'], ),
    sa.ForeignKeyConstraint(['relatorio_id'], ['relatorioGeral.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('relatorioperguntas')
    op.drop_table('relatoriogeral')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('relatoriogeral',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('jogador_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('quiz_id', mysql.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('jogador', mysql.VARCHAR(length=26), nullable=True),
    sa.Column('pontuacao_total', mysql.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('tempo_total', mysql.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('feedback', mysql.VARCHAR(length=250), nullable=False),
    sa.Column('ranking', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['jogador_id'], ['users.id'], name='relatoriogeral_ibfk_1'),
    sa.ForeignKeyConstraint(['quiz_id'], ['quiz.id'], name='relatoriogeral_ibfk_2'),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('relatorioperguntas',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('relatorio_id', mysql.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('perguntas_id', mysql.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('resposta', mysql.VARCHAR(length=300), nullable=False),
    sa.Column('correta', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['perguntas_id'], ['perguntas_quiz.id'], name='relatorioperguntas_ibfk_1'),
    sa.ForeignKeyConstraint(['relatorio_id'], ['relatoriogeral.id'], name='relatorioperguntas_ibfk_2'),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.drop_table('relatorioPerguntas')
    op.drop_table('relatorioGeral')
    # ### end Alembic commands ###
