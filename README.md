# Classroom Quizz - Um Sistema de Resposta para Estudantes Gamificado
<p align="center" display="inline-block">
  <img src="https://img.shields.io/badge/Python-FFD43B?style=for-the-badge&logo=python&logoColor=blue"/>
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white"/>
</p>

**Classroom Quizz** é um sistema desenvolvido no âmbito de um projeto de Iniciação Científica, com foco em promover uma aprendizagem ativa, envolvente e motivadora em sala de aula. O sistema funciona como um Game-Based Student Response System (GSRS), oferecendo uma plataforma de quizzes gamificados, semelhante ao Kahoot!, mas incorporando melhorias identificadas durante a pesquisa.

---

## Sumário

*   [Objetivo do Projeto](#objetivo-do-projeto)
*   [Documentação Detalhada](#documentação-detalhada)
    *   [Fundamentação Teórica](#fundamentação-teórica)
    *   [Especificação de Requisitos](#especificação-de-requisitos)
    *   [Modelo de Dados](#modelo-de-dados)
    *   [Resultados](#resultados)
*   [Instalação e Execução](#instalação-e-execução)
*   [Equipe do Projeto](#equipe-do-projeto)
*   [Licença](#licença)

---

## Objetivo do Projeto
O projeto visa desenvolver um **Game-Based Student Response System**, semelhante ao Kahoot!, incorporando melhorias e novas funcionalidades relacionadas à gamificação e ao feedback imediato. Busca-se também permitir o acompanhamento do desempenho dos estudantes, aprimorando a experiência tanto para professores quanto para alunos. Além disso, o projeto investiga os benefícios do uso de tecnologias educacionais e jogos sérios no processo de ensino-aprendizagem.

O sistema é disponibilizado como **software livre**, permitindo seu uso, estudo e adaptação.

**Objetivos Específicos**
*  Identificar possíveis melhorias no Kahoot!, por meio de revisão bibliográfica em artigos, livros e teses.
*  Elaborar o documento de requisitos do sistema, baseado nas funcionalidades do Kahoot!, especificando requisitos funcionais e não funcionais.
*  Criar o protótipo do sistema, a identidade visual.
*  Desenvolver o Modelo de dados, para compreensão da estrutura do sistema.
*  Desenvolver o jogo sério (serious game) para uso educacional, implementando suas funcionalidades principais.
*  Realizar testes das funcionalidades implementadas, avaliando o comportamento e o funcionamento do sistema.

---

## Documentação Detalhada

Para detalhes teóricos e técnicos, consulte os documentos específicos disponibilizados na pasta `/docs`:

### Fundamentação Teórica
Apresenta os conceitos, estudos e referências que embasam o desenvolvimento do projeto:
> [**FUNDAMENTACAO_TEORICA.md**](./docs/FUNDAMENTACAO_TEORICA.md)

### Especificação de Requisitos
Requisitos Funcionais e Não Funcionais do sistema estão detalhados em:

> [**REQUISITOS.md**](./docs/REQUISITOS.md)

### Modelo de Dados
Descrição completa da estrutura do banco de dados, incluindo tabelas, colunas e relacionamentos:

> [**MODELO_DADOS.md**](./docs/MODELO_DADOS.md)

### Resultados
Resultados obtidos ao longo do desenvolvimento, incluindo links para artigos produzidos:

> [**RESULTADOS.md**](./docs/RESULTADOS.md)

---

## Instalação e Execução

### Pré-requisitos

*   Python 3.12+
*   MySQL 8.0+
*   Git

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/ednilsonrossi/Classroom_Quizz.git
    cd Classroom_Quizz
    ```
    
2.  **Configuração do Backend**
    *   Instale as dependências:

        ```bash
        python3 -m venv venv
        source venv/bin/activate  # Linux/MacOS
        # ./venv/Scripts/activate  # Windows
        pip install -r requirements.txt
        ```
      
3.  **Configuração do Banco de Dados:**

    No seu cliente MySQL, crie o banco de dados:

    ```sql
    CREATE DATABASE classroom_quizz;
    ```

    Em seguida, aplique as migrações do banco de dados:

    ```shell
    # Dentro da pasta /app com o venv ativado
    flask db upgrade
    ```

4.  **Configure as Variáveis de Ambiente:**

    Renomeie o arquivo `.env.example` para `.env` e preencha com suas credenciais do MySQL:

    ```ini
    DATABASE_URL=mysql+pymysql://{usuario}:{senha}@localhost:3306/classroom_quizz
    SECRET_KEY=sua_chave_secreta_aqui

    MAIL_SERVER=smtp.gmail.com
    MAIL_PORT=587  # Para envio TLS (para SSL, use 465)
    MAIL_USERNAME=seu_email@gmail.com
    MAIL_PASSWORD=sua_chave_app  # Deve ser uma chave de app
    ```

5.  **Execução do Projeto**
    *   Na pasta `/app`, com o ambiente virtual ativado, execute:

        ```bash
        python index.py
        # Disponível em http://127.0.0.1:5000
        ```
      
---

## Equipe do Projeto

*   **Samuel Fernandes Filho - Desenvolvedor** - [Samuel-fernandesf](https://github.com/Samuel-fernandesf)
*   **Ednilson Geraldo Rossi - Orientador** - [ednilsonrossi](https://github.com/ednilsonrossi)
*   **Janaína Cintra Abib - Orientadora** - [janaina-abib](https://github.com/janaina-abib)

---

## Licença

Este projeto é distribuído sob a licença **MIT**.
