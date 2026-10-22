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

- [Objetivo do Projeto](#objetivo-do-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Documentação](#documentação)
  - [Fundamentação Teórica](#fundamentação-teórica)
  - [Especificação de Requisitos](#especificação-de-requisitos)
  - [Modelo de Dados](#modelo-de-dados)
  - [Desenvolvimento do Sistema](#desenvolvimento-do-sistema)
  - [Resultados Acadêmicos](#resultados-acadêmicos)
- [Instalação e Execução](#instalação-e-execução)
- [Equipe do Projeto](#equipe-do-projeto)
- [Licença](#licença)

---

## Objetivo do Projeto
O projeto visa desenvolver um **Game-Based Student Response System**, semelhante ao Kahoot!, incorporando melhorias e novas funcionalidades relacionadas à gamificação e ao feedback imediato. Busca-se também permitir o acompanhamento do desempenho dos estudantes, aprimorando a experiência tanto para professores quanto para alunos. Além disso, o projeto investiga os benefícios do uso de tecnologias educacionais e jogos sérios no processo de ensino-aprendizagem.

O sistema é disponibilizado como **software livre**, permitindo seu uso, estudo e adaptação.

**Objetivos Específicos**

- Investigar, por meio de revisão bibliográfica, conceitos e abordagens relacionados a sistemas de resposta estudantil, gamificação e jogos sérios.
- Elaborar a especificação dos requisitos funcionais e não funcionais do sistema.
- Desenvolver o protótipo e definir a identidade visual da aplicação.
- Modelar o banco de dados e seus relacionamentos.
- Implementar as funcionalidades do sistema de criação e gerenciamento de quizzes.
- Desenvolver recursos de apoio à aprendizagem, incluindo explicações detalhadas para as questões.
- Realizar testes técnicos das funcionalidades implementadas.
- Investigar futuramente a utilização da ferramenta em contextos educacionais.

## Tecnologias Utilizadas

As principais tecnologias utilizadas no desenvolvimento são:

| Tecnologia | Finalidade |
|---|---|
| Python | Linguagem de programação do backend. |
| Flask | Desenvolvimento da API e da aplicação backend. |
| React | Construção da interface frontend. |
| Vite | Ferramenta de desenvolvimento e construção do frontend. |
| JavaScript | Desenvolvimento da interface e da lógica frontend. |
| MySQL | Armazenamento persistente dos dados. |
| SQLAlchemy | Mapeamento objeto-relacional e acesso aos dados. |
| Alembic | Gerenciamento de migrações do banco de dados. |
| Flask-SocketIO | Suporte à comunicação em tempo real. |
| Tailwind CSS | Estilização da interface. |
| JWT e cookies HTTPOnly | Mecanismos utilizados na autenticação. |
| Git e GitHub | Versionamento e hospedagem do código-fonte. |

Para obter informações sobre a arquitetura e o estágio atual de implementação, consulte a documentação de desenvolvimento.

---

## Documentação

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

### Desenvolvimento do Sistema

Apresenta a arquitetura, as tecnologias utilizadas, as funcionalidades implementadas, as limitações conhecidas e os trabalhos futuros.

> [**DESENVOLVIMENTO.md**](./docs/DESENVOLVIMENTO.md)

### Resultados Acadêmicos

Reúne as publicações científicas e as apresentações acadêmicas relacionadas ao projeto de Iniciação Científica.

>[**RESULTADOS.md**](./docs/RESULTADOS.md)

---

## Instalação e Execução

### Pré-requisitos

Antes de começar, instale:

- Git;
- Python 3.12 ou superior;
- MySQL 8.0 ou superior;
- Node.js e npm.

### 1. Clonar o repositório

```bash
git clone https://github.com/ednilsonrossi/Classroom_Quizz.git
cd Classroom_Quizz
```

### 2. Configurar o ambiente Python

Crie e ative um ambiente virtual para o backend.

**Linux/macOS:**

```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows — PowerShell:**

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Instale as dependências Python a partir do diretório /backend que contém o arquivo `requirements.txt`:

```bash
pip install -r requirements.txt
```

### 3. Configurar as variáveis de ambiente

O projeto utiliza arquivos de configuração distintos para o backend e o frontend. Ambos devem ser configurados antes da execução.

#### Backend

O arquivo `.env.example` do backend está na raiz do projeto.

1. Faça uma cópia do arquivo `.env.example`.
2. Renomeie a cópia para `.env`.
3. Preencha as variáveis de acordo com o seu ambiente.

As principais variáveis são:

| Variável | Finalidade |
|---|---|
| `DATABASE_URL` | Endereço de conexão com o banco de dados MySQL. |
| `FRONTEND_URL` | Endereço em que o frontend estará disponível. |
| `API_URL` | Endereço em que a API estará disponível. |
| `FLASK_ENV` | Configuração do ambiente de execução do Flask. |
| `SECRET_KEY` | Chave secreta utilizada pela aplicação. |
| `JWT_SECRET_KEY` | Chave secreta utilizada na autenticação JWT. |
| `MAIL_SERVER` | Servidor SMTP utilizado no envio de e-mails. |
| `MAIL_PORT` | Porta do servidor SMTP. |
| `MAIL_USERNAME` | Conta utilizada para o envio de e-mails. |
| `MAIL_PASSWORD` | Senha ou credencial de aplicação utilizada no SMTP. |

Exemplo de configuração:

```ini
DATABASE_URL=mysql+pymysql://usuario:senha@localhost:3306/classroom_quizz

FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000

FLASK_ENV=development

SECRET_KEY=sua_chave_secreta
JWT_SECRET_KEY=sua_chave_secreta_para_jwt

MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=seu_email@gmail.com
MAIL_PASSWORD=sua_chave_de_aplicativo
```

Substitua os valores de exemplo pelas configurações do seu ambiente. Se estiver utilizando o sistema em uma rede local, configure os endereços conforme necessário.

#### Frontend

O arquivo `.env.example` do frontend está dentro da pasta `frontend`.

1. Entre na pasta `frontend`.
2. Faça uma cópia do arquivo `.env.example`.
3. Renomeie a cópia para `.env`.
4. Configure a variável `VITE_URL_API` com o endereço da API do backend.

Exemplo:

```ini
VITE_URL_API=http://localhost:5000
```

O endereço deve corresponder ao endereço em que o backend estiver sendo executado.

Se o frontend for acessado por outros dispositivos da rede local, verifique também se os endereços configurados permitem essa comunicação.

### 4. Configurar o banco de dados

Acesse o MySQL e crie o banco de dados:

```sql
CREATE DATABASE classroom_quizz;
```

Verifique se o nome do banco e as credenciais correspondem à configuração da variável `DATABASE_URL`.

### 5. Aplicar as migrações

Com o ambiente virtual ativado, acesse o diretório do backend e execute:

```bash
flask db upgrade
```

Esse comando aplica as migrações disponíveis ao banco de dados.

### 6. Instalar as dependências do frontend

Entre no diretório `frontend`:

```bash
cd frontend
npm install
```

O comando instala as dependências definidas no arquivo `package.json`.

### 7. Executar o projeto

O backend e o frontend devem ser iniciados em terminais separados.

**Backend**

No diretório do backend, com o ambiente virtual ativado, execute:

```bash
python run.py
```

**Frontend**

No diretório `frontend`, execute:

```bash
npm run dev
```

Após iniciar os dois serviços, acesse o endereço informado pelo servidor de desenvolvimento do frontend.

Verifique se o frontend consegue se comunicar com a API e se o backend consegue acessar o banco de dados.

---

## Equipe do Projeto

*   **Samuel Fernandes Filho - Desenvolvedor** - [Samuel-fernandesf](https://github.com/Samuel-fernandesf)
*   **Ednilson Geraldo Rossi - Orientador** - [ednilsonrossi](https://github.com/ednilsonrossi)
*   **Janaína Cintra Abib - Orientadora** - [janaina-abib](https://github.com/janaina-abib)

---

## Licença

Este projeto é distribuído sob a licença **MIT**.