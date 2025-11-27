# Especificação de Requisitos

## Índice

1. [Visão Geral do Sistema](#1-visão-geral-do-sistema)
2. [Público-Alvo](#2-público-alvo)
3. [Classificação dos Requisitos](#3-classificação-dos-requisitos)
4. [Requisitos Funcionais (RF)](#4-requisitos-funcionais-rf)
   - [Cadastro e Login](#41-cadastro-e-login)
   - [Criação e Gestão dos Quizzes](#42-criação-e-gestão-dos-quizzes)
   - [Chats e Mensagens](#43-chats-e-mensagens)
   - [Gamificação e Fluxo do Jogo](#44-gamificação-e-fluxo-do-jogo)
   - [Relatório e Feedback](#45-relatório-e-feedback)
5. [Requisitos Não Funcionais (RNF)](#5-requisitos-não-funcionais-rnf)
   - [Desempenho](#51-desempenho)
   - [Usabilidade e Acessibilidade](#52-usabilidade-e-acessibilidade)
   - [Segurança e Portabilidade](#53-segurança-e-portabilidade)
   - [Ferramentas](#54-ferramentas)

---

## 1. Visão Geral do Sistema
O sistema **Classroom Quiz** será implementado como um Game-Based Student Response System (GSRS), acessível via navegador web em dispositivos desktop e responsivo para dispositivos móveis (celulares e tablets). Seu objetivo principal é promover uma aprendizagem ativa, envolvente e motivadora em salas de aula, através de uma plataforma de quiz gamificada, semelhante ao Kahoot!. O projeto visa superar as limitações do Kahoot!, oferecendo novas funcionalidades de gamificação, feedback detalhado e sendo disponibilizado como Software Livre (Código Aberto).

---

## 2. Público-Alvo

O sistema define dois perfis de usuários principais, cada um com responsabilidades e funcionalidades distintas:

  * **Professor:** Responsável por criar e gerenciar os quizzes, iniciar as sessões de jogo, comandar o fluxo da partida (incluindo a possibilidade de pausar para explicações), acessar os relatórios detalhados de desempenho e compartilhar quizzes por meio de chats interativos entre os estudantes.
  
  * **Aluno:** Usuário responsável por realizar o cadastro e login, ingressar nas sessões de jogo usando o PIN da sala, responder às questões, acessar seu histórico de desempenho e conversar por meio de chats interativos com colegas e professores, podendo também compartilhar quizzes.

---

## 3. Classificação dos Requisitos
Os requisitos para o desenvolvimento e implementação do Classroom Quiz estão classificados nas seguintes categorias:

  * **Requisitos Funcionais (RF):** Especificam os serviços e funcionalidades que o sistema deve fornecer ao usuário. Eles definem o que o sistema fará, e a forma como ele processará entradas e responderá em determinadas situações. São os requisitos obrigatórios, que descrevem o comportamento principal do software.
  
  * **Requisitos Não Funcionais (RNF):** Especificam os critérios de qualidade e as restrições que o sistema deve cumprir. Eles descrevem como o sistema deve ser (rápido, seguro, intuitivo). Dessa forma, os RNF atuam como um complemento obrigatório dos requisitos funcionais.

---

## 4. Requisitos Funcionais (RF)

### 4.1. Cadastro e Login

| ID | Descrição | Autor(es) | Base |
| :--- | :--- | :--- | :--- |
| **RF001** | O sistema deve permitir o cadastro de novo usuário com coleta de e-mail, senha, nome de usuário, nome, sobrenome, seleção do Tipo de Conta (Professor ou Aluno) e data de criação da conta. | Aluno e Professor | Cadastro |
| **RF002** | O sistema deve solicitar a data de nascimento para todos os usuários. Deve ser validado que: (a) Professores têm no mínimo 18 anos; e (b) Alunos têm no mínimo 13 anos. | Aluno e Professor | Cadastro |
| **RF003** | O sistema deve permitir que os usuários façam login utilizando o e-mail e senha cadastrados. Também deve permitir o logout da conta. | Aluno e Professor | Login/Logout |

### 4.2. Criação e Gestão dos Quizzes

| ID | Descrição | Autor(es) | Base |
| :--- | :--- | :--- | :--- |
| **RF004** | O sistema deve permitir ao Professor criar, editar e excluir Quizzes. | Professor | Criação |
| **RF005** | O sistema deve permitir a criação de questões nos formatos: Múltipla Escolha (com flexibilidade no número de alternativas) e Verdadeiro/Falso. | Professor | Criação |
| **RF006** | O sistema deve permitir que o Professor defina o Tempo Limite e Pontuação para cada questão. Além de uma descrição da pergunta. | Professor | Configuração |
| **RF007** | Deve ser possível modificar o texto, como o tamanho da letra, fonte, cor, negrito, itálico entre outros. | Professor | Formatação |
| **RF008** | Deve ser possível inserir imagens, e vídeos incorporados nos questionários.	| Professor	| Multimídia |
| **RF009** | O sistema deve permitir que o Professor configure um texto de Correção (que pode conter imagens) para cada questão. | Professor	| Feedback |
| **RF010** | O sistema deve armazenar as questões criadas para permitir a reutilização em múltiplos quizzes (Banco de Questões). Porém, ao reutilizar uma questão, essa questão é duplicada integralmente no banco para garantir sua independência. | Professor	| Reutilização |

### 4.3 Chats e Mensagens
| ID | Descrição | Autor(es) | Base |
| :--- | :--- | :--- | :--- |
| **RF011** | O sistema deve prover chats em tempo real, suportando a criação e controle de canais Privados (entre dois usuários) e Públicos (entre múltiplos usuários).	| Professor e Aluno |	Comunicação |
| **RF012** | O sistema deve permitir o envio de dois tipos de conteúdo na Tabela Mensagens: Texto (conteudo_txt) e o ID de um Quiz compartilhado (conteudo_quiz_id).	| Professor e Aluno | Mensagens |
| **RF013** | O sistema deve permitir o compartilhamento de quizzes por meio de chats, podendo adicionar o quiz à biblioteca.	| Professor e Aluno |	Compartilhamento |
| **RF014** | O sistema deve garantir que, ao receber um quiz compartilhado, o backend duplique esse quiz (incluindo questões e alternativas) para a conta do destinatário.	| Professor e Aluno	| Duplicação |
| **RF015** | O sistema deve armazenar todas as mensagens enviadas no banco de dados, para garantir um histórico e backup das mensagens, mesmo em caso de encerramento do servidor | Professor e Aluno |	Persistência |
| **RF016** | O backend deve verificar o tipo de mensagem enviado (texto ou id do quiz) antes de salvar a mensagem.	| Professor e Aluno	| Integridade |
| **RF017** | O sistema deve permitir que o usuário busque outros usuários para iniciar um chat privado utilizando o username cadastrado.	| Professor e Aluno	| Buscar contatos |
| **RF018** | O sistema deve permitir que o usuário administrador de um grupo adicione usuários por meio do username cadastrado. | Professor e Aluno	| Adicionar participantes |
| **RF019** | O sistema deve permitir que o usuário administrador do chat possa remover participantes de um chat.	| Professor e Aluno | Exclusão de participantes |

### 4.4. Gamificação e Fluxo do Jogo
| ID | Descrição | Autor(es) | Base |
| :--- | :--- | :--- | :--- |
| **RF020** | O sistema deve permitir ao Professor iniciar uma sessão de jogo e gerar um código de acesso (PIN) para que os alunos possam ingressar. | Professor	| Jogo |
| **RF021** | O aluno deve conseguir ingressar na sessão utilizando o PIN gerado, com o seu nome de usuário e avatar. Não sendo necessário ter um cadastro no sistema. | Aluno | Jogo |
| **RF022** | O sistema deve calcular a pontuação do aluno com base no acerto da questão e velocidade de resposta, respeitando a pontuação base. | Professor e Aluno	| Cálculo de Pontuação |
| **RF023** | O sistema deve exibir a classificação geral (Ranking) dos alunos após cada questão, destacando de forma clara os 5 melhores jogadores. | Professor e Aluno | Gamificação |
| **RF024** | O professor deve ter a capacidade de pausar o jogo a qualquer momento para explicações adicionais. | Professor | Controle do Jogo |
| **RF025** | O sistema deve exibir o Pódio ao final da partida, celebrando os 3 melhores jogadores com destaque visual para o 1º lugar. | Aluno |	Gamificação |
| **RF026** | O sistema deve exibir um Feedback Imediato para o Aluno (na sua tela) indicando se ele acertou ou errou a questão, e a pontuação obtida.	| Aluno |	Feedback |

### 4.5. Relatório e Feedback
| ID | Descrição | Autor(es) | Base |
| :--- | :--- | :--- | :--- |
| **RF027** | O Professor deve poder acessar, ao final do jogo, um Relatório de Desempenho da turma, que deve indicar os acertos e erros de cada aluno e áreas de dificuldade. Mostrando uma visão individual e geral da turma.	| Professor |	Análise da Turma |
| **RF028** | O sistema deve permitir ao Aluno acessar seu perfil e visualizar seu histórico, contendo um histórico de todos os quizzes realizados e seus relatórios. |	Aluno	| Histórico |
| **RF029** | O Aluno deve conseguir filtrar as questões de um quiz realizado em seu histórico, separando as que ele acertou das que ele errou.	| Aluno	| Filtro |

---

## 5. Requisitos Não Funcionais (RNF)

### 5.1. Desempenho
| ID | Descrição | Categoria |
| :--- | :--- | :--- |
| **RNF001** | O sistema deverá suportar, simultaneamente muitos usuários (Alunos e Professores) ativos em uma única sessão de jogo sem latência perceptível. | Desempenho |
| **RNF002** | Deve ter um tempo mínimo para o processamento dos dados coletados dos alunos, às suas respostas.	| Desempenho |
| **RNF003** | O sistema não pode apresentar diferenças de tempo de carregamento ou atraso na informação entre os usuários durante a sessão de jogo.	| Desempenho |

### 5.2. Usabilidade e Acessibilidade
| ID | Descrição | Categoria |
| :--- | :--- | :--- |
| **RNF004** | O sistema deve apresentar uma interface atraente, intuitiva e colorida, garantindo facilidade de uso tanto para usuários iniciantes quanto para experientes.	| Usabilidade |
| **RNF005** | A interface deve utilizar formas e texturas (além de cores) para diferenciar as opções de resposta e garantir a acessibilidade a usuários com deficiência visual (ex: daltonismo).	| Acessibilidade |
| **RNF006** | O sistema deve permitir que o usuário personalize seu avatar e apelido para uso nas sessões de jogo.	| Usabilidade |

### 5.3. Segurança e Portabilidade
| ID | Descrição | Categoria |
| :--- | :--- | :--- |
| **RNF007** | Todas as senhas de usuário devem ser armazenadas utilizando criptografia hash (Flask-Bcrypt).	| Segurança |
| **RNF008** | O sistema deve ser responsivo, garantindo usabilidade e funcionalidade completas em navegadores web de desktop e dispositivos móveis.	| Portabilidade |
| **RNF009** | O sistema deve ser disponibilizado como Software Livre (Código Aberto), licenciando o código-fonte para uso e modificação.	| Licença |

### 5.4. Ferramentas
| ID | Descrição | Categoria |
| :--- | :--- | :--- |
| **RNF010** | O sistema deve ser desenvolvido utilizando a linguagem Python e o framework Flask para a implementação do backend (lógica de API).	| Tecnologia |
| **RNF011** | A interface de usuário (frontend) deve ser desenvolvida utilizando a biblioteca React para garantir modularidade.	| Tecnologia |
| **RNF012** | O banco de dados para armazenamento persistente deve ser o SGBD MySQL e para comunicação em tempo real deve usar a biblioteca Flask-socketIO. | Tecnologia |
