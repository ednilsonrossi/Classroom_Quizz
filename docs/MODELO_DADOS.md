# Modelo de Dados e Estrutura do Banco de Dados

## 1. Decisões e Regras de Modelagem

Este tópico formaliza as decisões que foram tomadas para a remodelagem do banco de dados do sistema para atender ao Requisitos Funcionais (RF) do projeto.

---

### 1.1. Duplicação de Quizzes ao Compartilhar

O sistema contará com um chat de conversas entre os professores e estudantes, onde será possível compartilhar quizzes. 
	
**Regra de Negócio Central:** Quando o usuário adiciona um quiz compartilhado à sua biblioteca, o sistema gera uma nova instância independente do quiz original, ocorre uma duplicação completa.

*  **Motivo da duplicação:** Se o quiz compartilhado fosse apenas um ponteiro para o original, qualquer alteração feita pelo criador afetaria todos os usuários que receberam o quiz, o que comprometeria a integridade dos dados e a experiência do usuário.

*  **Implementação no Banco de Dados:** Quando um quiz é compartilhado o sistema duplica a estrutura do quiz completa (`QUIZ`, `QUESTAO` e `ALTERNATIVAS`):
    *   Cria um registro em `QUIZ`, com ID novo.
    *   Duplica todas as questões relacionadas ao Quiz, gera novos IDs.
    *   Duplica todas as alternativas relacionadas a cada pergunta, gera novos IDs.

*	**Atribuição de Autoria:** Para rastrear o criador, foi adicionado um atributo de Chave Estrangeira (FK) na tabela Quiz que referencia o usuário criador.

---

### 1.2. Remoção do Banco de Questões e Reutilização

O Banco de Questões foi retirado do modelo, sendo agora a própria tabela `QUESTOES`, já que toda questão adicionada poderá ser reutilizada. 

*  **Regra de Reutilização:** Ao reutilizar uma questão para um novo quiz, uma nova instância é gerada, com um novo ID. A duplicação ocorre mesmo que a alteração seja mínima, e as alternativas da questão também são copiadas e reutilizadas.

---

### 1.3. Estrutura de Questão e Flexibilidade de Alternativas

A modelagem utiliza duas tabelas separadas: `QUESTAO` e `ALTERNATIVA`. Isso garante flexibilidade, pois o número de alternativas por questão pode ser diferente evitando limitações como número fixo de 2 a 5 alternativas. Além disso, auxilia na coleta de dados para relatórios, permitindo o levantamento da quantidade de alunos que escolheram cada alternativa. A alternativa correta é definida pelo campo `is_correct` (Booleano) na tabela `ALTERNATIVA`. Este modelo permite que sejam definidas múltiplas alternativas corretas por questão.

---

### 1.4. Modelo de Correção

Não haverá uma tabela separada chamada `CORRECAO`. Dois novos atributos serão adicionados na tabela `QUESTAO`: `correcao_texto` e `correcao_img`. A correção é opcional e funciona como um slide adicional na interface, portanto, os atributos são definidos como nulos.

---

### 1.5. Persistência e Conteúdo do Chat

O sistema terá chats em tempo real (Privado – entre dois usuários ou Público – vários usuários), utilizando a biblioteca Flask-socketIO no backend.

*  **Persistência e Backup:** Todas as mensagens serão salvas no banco de dados, como uma forma de backup, para garantir histórico, caso o servidor seja encerrado, não ocorra perda das mensagens.
*  **Validação:** No backend, deverá ser feita uma verificação quanto ao tipo de mensagem (`texto` ou `quiz_id`) para garantir a integridade dos dados ao salvar no banco.

---

## 2. Modelo Conceitual (Baixo Nível)

O **Modelo Conceitual** representa a primeira etapa da modelagem de dados, focando na identificação das entidades do mundo real e dos relacionamentos cruciais para o sistema, contendo apenas atributos principais, não sendo necessário o uso de qualquer Sistema Gerenciador de Banco de Dados (SGBD). 

Nesta fase inicial, o objetivo principal é definir o que o sistema deve armazenar (entidades) e como essas entidades interagem (relacionamentos). O diagrama a seguir apresenta a visão inicial das entidades e seus relacionamentos. Dada a complexidade e a quantidade de entidades necessárias para o sistema, o diagrama possui muitos detalhes, servindo como uma visão estrutural do modelo. A tradução completa, com a lista de atributos, suas restrições e tipos de dados, será detalhada no **Tópico 2.4**.

![Modelo Conceitual do Classroom Quizz](./imgs/Modelo Conceitual (v3.1).png)


