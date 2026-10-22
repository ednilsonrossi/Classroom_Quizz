# Desenvolvimento do Sistema — Classroom Quizz

## 1. Visão Geral

O desenvolvimento do Classroom Quiz envolveu a especificação de requisitos, a modelagem do banco de dados e a implementação progressiva das funcionalidades da aplicação.

Durante o projeto, a arquitetura foi reorganizada para separar o backend do frontend. A implementação anterior utilizava templates renderizados pelo Flask, enquanto a arquitetura atual utiliza uma API desenvolvida com Flask e uma interface construída com React.

## 2. Arquitetura e Tecnologias

A arquitetura atual utiliza as seguintes tecnologias:

- **Python e Flask:** implementação do backend e da API.
- **React:** desenvolvimento da interface frontend.
- **Vite:** ferramenta de desenvolvimento e construção do frontend.
- **MySQL:** armazenamento persistente dos dados.
- **SQLAlchemy:** mapeamento objeto-relacional e interação com o banco de dados.
- **Alembic:** gerenciamento de migrações do banco de dados.
- **Flask-SocketIO:** suporte previsto para funcionalidades de comunicação em tempo real.
- **Tailwind CSS:** estilização da interface.
- **JWT e cookies HTTPOnly:** mecanismos utilizados na autenticação e no gerenciamento de sessões.
- **Git e GitHub:** versionamento e gerenciamento do código-fonte.

A utilização dessas tecnologias permite organizar a aplicação em componentes distintos, facilitando a manutenção e a evolução dos módulos do sistema.

## 3. Funcionalidades Implementadas

As funcionalidades abaixo representam o estado de desenvolvimento registrado até o momento. A conformidade integral com cada requisito deve ser verificada durante a revisão do código.

| Funcionalidade | Descrição | Situação |
|---|---|---|
| Cadastro e autenticação | Cadastro de usuários, login e logout. | Implementado. |
| Confirmação de e-mail | Processo de confirmação do endereço de e-mail. | Implementado. |
| Recuperação de senha | Processo para recuperação de acesso à conta. | Implementado. |
| Gerenciamento de quizzes | Criação, listagem e exclusão de quizzes. | Parcialmente implementado; a edição ainda não foi implementada. |
| Criação de questões | Questões de múltipla escolha e verdadeiro/falso. | Implementado. |
| Correções detalhadas | Cadastro de explicações com texto e imagens para as questões. | Implementado. |
| Reutilização de questões | Reutilização de questões em diferentes quizzes, com duplicação dos dados para manter sua independência. | Implementado. |
| Organização de quizzes | Organização dos quizzes em pastas. | Implementado. |
| Interface web | Interface desenvolvida com React e recursos de responsividade. | Implementada; melhorias de responsividade, usabilidade e apresentação visual ainda são necessárias. |

A implementação das funcionalidades descritas não significa, por si só, que todos os requisitos funcionais e não funcionais relacionados estejam integralmente atendidos.

A edição de quizzes permanece pendente. Além disso, a interface precisa passar por uma revisão de estilos e usabilidade, visando melhorar a experiência de utilização.

## 4. Situação dos Requisitos

O levantamento de requisitos define as funcionalidades previstas para o Classroom Quiz e os critérios de qualidade esperados. A situação de desenvolvimento deve ser acompanhada com base nos identificadores presentes em `REQUISITOS.md`.

### 4.1. Cadastro e Gerenciamento de Quizzes

Os módulos de autenticação, gerenciamento de quizzes, criação de questões, correções detalhadas, reutilização de questões e organização em pastas possuem implementações registradas.

Entretanto, o gerenciamento de quizzes ainda não está completo, pois a funcionalidade de edição permanece pendente.

Também é necessário verificar cada requisito individualmente, incluindo suas regras de validação, restrições de acesso e comportamentos esperados.

### 4.2. Chats e Compartilhamento

O levantamento prevê comunicação entre usuários por meio de canais privados e públicos, persistência das mensagens e compartilhamento de quizzes.

**Estado:** pendente de implementação e validação, conforme o estado de desenvolvimento registrado.

Os requisitos relacionados a esse módulo são RF011 a RF019.

### 4.3. Gamificação e Fluxo do Jogo

O sistema foi planejado para permitir que professores iniciem partidas por meio de um PIN, que estudantes ingressem nas sessões e que o sistema gerencie respostas, pontuação, classificação e pódio.

Também está prevista a possibilidade de o professor pausar uma partida para apresentar explicações adicionais.

**Estado:** pendente de implementação e validação, conforme o estado de desenvolvimento registrado.

Os requisitos relacionados a esse módulo são RF020 a RF026.

### 4.4. Relatórios e Histórico de Desempenho

O levantamento prevê relatórios para professores, histórico individual dos estudantes e filtros que permitam consultar questões respondidas corretamente ou incorretamente.

**Estado:** pendente de implementação e validação, conforme o estado de desenvolvimento registrado.

Os requisitos relacionados a esse módulo são RF027 a RF029.

### 4.5. Requisitos Não Funcionais

Além das funcionalidades, o sistema deve atender aos critérios de desempenho, usabilidade, acessibilidade, segurança e portabilidade definidos no levantamento de requisitos.

Esses critérios precisam ser verificados por meio de testes apropriados. A implementação de uma funcionalidade não comprova automaticamente que os requisitos de qualidade relacionados foram atendidos.

Entre as verificações necessárias estão:

- Avaliação do desempenho em cenários com múltiplos usuários.
- Verificação da responsividade em diferentes dispositivos e navegadores.
- Revisão dos estilos e da organização visual da interface.
- Avaliação dos mecanismos de segurança e proteção das contas.
- Verificação de aspectos de acessibilidade da interface.
- Confirmação das condições de distribuição e licenciamento do código-fonte.

## 5. Limitações e Trabalhos Futuros

Apesar das funcionalidades já implementadas, o Classroom Quiz ainda precisa evoluir para contemplar integralmente a proposta estabelecida no levantamento de requisitos.

As principais etapas previstas são:

1. **Consolidar os módulos existentes:** revisar as funcionalidades implementadas e verificar sua conformidade com os requisitos.
2. **Implementar a edição de quizzes:** permitir que os usuários alterem os dados dos quizzes já cadastrados.
3. **Implementar as partidas em tempo real:** desenvolver o fluxo completo de criação de salas, ingresso por PIN, recebimento de respostas e gerenciamento da partida.
4. **Desenvolver a gamificação das sessões:** implementar pontuação, classificação, feedback imediato e apresentação do pódio.
5. **Implementar os chats:** desenvolver a comunicação entre usuários, a persistência das mensagens e o gerenciamento de participantes.
6. **Implementar o compartilhamento de quizzes:** permitir o envio de quizzes entre usuários e sua duplicação para a conta do destinatário.
7. **Desenvolver os relatórios e o histórico:** disponibilizar informações sobre o desempenho individual e coletivo dos estudantes.
8. **Aprimorar a interface:** revisar os estilos, a responsividade, a navegação e a usabilidade, buscando proporcionar uma experiência de utilização mais consistente.
9. **Realizar testes técnicos:** verificar o comportamento da aplicação, o desempenho, a segurança e a usabilidade.
10. **Planejar a validação educacional:** avaliar a utilização do sistema em um contexto de ensino e investigar sua contribuição para o processo de aprendizagem.

## 6. Considerações Finais

O desenvolvimento do Classroom Quiz resultou em uma aplicação com funcionalidades voltadas à criação e ao gerenciamento de quizzes, incluindo questões com correções detalhadas e recursos para organização e reutilização de conteúdos.

A evolução da arquitetura para uma aplicação com backend e frontend separados também estabelece uma base para a implementação dos módulos previstos no levantamento de requisitos.

Entretanto, ainda existem funcionalidades pendentes, como a edição de quizzes, além de melhorias necessárias na interface e da implementação dos módulos de interação e execução de partidas.

O desenvolvimento técnico da ferramenta e a avaliação de seus efeitos educacionais constituem etapas distintas. A hipótese de que o feedback detalhado pode contribuir para a aprendizagem e reduzir respostas baseadas em tentativas aleatórias ainda precisa ser investigada por meio de testes e avaliações apropriadas.

Dessa forma, a continuidade do projeto envolve a implementação das funcionalidades pendentes, o aprimoramento da interface e a validação técnica e educacional da aplicação.

## 7. Documentação Relacionada

- [README principal](../README.md) — apresentação geral do projeto e instruções de utilização.
- [Fundamentação Teórica](FUNDAMENTACAO_TEORICA.md) — conceitos e referências científicas que fundamentam a pesquisa.
- [Especificação de Requisitos](REQUISITOS.md) — requisitos funcionais e não funcionais do sistema.
- [Modelo de Dados](MODELO_DADOS.md) — estrutura do banco de dados e relacionamentos.
- [Código Legado](legacy/README.md) — registro da implementação anterior.

---

*Este documento deve ser atualizado conforme novas funcionalidades forem implementadas, os requisitos forem verificados e novos resultados científicos forem produzidos.*