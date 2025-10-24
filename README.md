# ToDo List API com Node.js e Front-end Básico

Este é um projeto simples de lista de tarefas (ToDo List) desenvolvido para demonstrar uma arquitetura básica de Full Stack, utilizando Node.js/Express para o Backend (API REST) e HTML, CSS e JavaScript puro para o Frontend.

##  Funcionalidades

O projeto implementa todas as operações essenciais de um CRUD:

- **Listar Tarefas (GET):** Exibe apenas as tarefas pendentes (`completa = 0`).
- **Criar Tarefas (POST):** Adiciona novas tarefas à lista.
- **Editar Tarefas (PUT):** Atualiza o título de uma tarefa existente.
- **Concluir Tarefas (PATCH):** Marca uma tarefa como completa (`completa = 1`).
- **Excluir Tarefas (DELETE):** Remove permanentemente uma tarefa.
- **Alternar Tema (UI):** Funcionalidade de Dark/Light Mode com persistência no LocalStorage.

##  Tecnologias Utilizadas

**Backend (API):**

- **Node.js:** Ambiente de execução.
- **Express:** Framework web para roteamento e middlewares.
- **SQLite (Simulação):** Armazenamento de dados.
- **CORS:** Middleware para permitir requisições do frontend.

**Frontend (Client):**

- **HTML5:** Estrutura da aplicação.
- **CSS3:** Estilização responsiva e temas (Dark/Light Mode).
- **JavaScript (ES6+):** Lógica de consumo da API (`fetch` e `async/await`), manipulação do DOM e lógica de temas.

### Pré-requisitos

Certifique-se de ter o Node.js e o npm instalados em sua máquina.