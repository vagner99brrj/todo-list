# ToDo List Full Stack (MVC)

Projeto de gerenciamento de tarefas desenvolvido com **Node.js** e **Vanilla JavaScript**. 
O objetivo principal é demonstrar a implementação de uma arquitetura **MVC (Model-View-Controller)**, operações CRUD completas e persistência de dados com SQLite.

## 🚀 Tecnologias

- **Backend:** Node.js, Express, SQLite3, **JSON Web Token (JWT)**, CORS.
- **Frontend:** HTML5, CSS3, JavaScript (ES6+).
- **Arquitetura:** MVC (Model-View-Controller).
- **Database:** SQLite (Arquivo local `todo.db`).
## 📋 Funcionalidades

- **Autenticação (Segura):** Login e Cadastro protegidos por **JWT** no Backend.
- **Segurança de Rota:** Todas as rotas `/tarefas` exigem Token válido.
- **Gerenciamento de Token:** O Frontend salva e envia o token no `Authorization Header`.
- **CRUD de Tarefas:** Criar, Listar, Editar e Excluir tarefas.
- **Histórico:** Filtros para visualizar tarefas "Pendentes" ou "Concluídas".
- **UI/UX:** Dark Mode com persistência automática (LocalStorage).

## 📂 Estrutura do Projeto

```text
/
├── controllers/    # Lógica de controle (Regras de negócio)
├── middlewares/    # Lógica de interceptação (Ex: Verificação de Token JWT)
├── models/         # Acesso ao Banco de Dados (SQL queries)
├── public/         # Frontend (HTML, CSS, JS estáticos)
├── app.js          # Entrada do servidor e rotas
├── database.js     # Configuração e conexão SQLite
└── todo.db         # Arquivo do banco de dados (gerado automaticamente)

🛠️ Como Rodar
Clone o repositório

Bash

git clone https://github.com/vagner99brrj/todo-list.git
cd todo-list

Instale as dependências
Bash
npm install

Configure o Segredo Crie o arquivo .env na raiz do projeto e defina uma chave segura:
Ini, TOML
JWT_SECRET=sua_chave_secreta_aqui

Inicie o Servidor
Bash
npm run dev

Acesse Abra http://localhost:2000 no seu navegador.

🔌 API Endpoints
Tarefas
GET /tarefas - Lista todas as pendentes.

GET /tarefas/concluidas - Lista histórico de concluídas.

POST /tarefas - Cria nova tarefa.

PUT /tarefas/:id - Atualiza título.

PATCH /tarefas/:id - Atualiza status (completa/incompleta).

DELETE /tarefas/:id - Remove tarefa.

Usuários
POST /register - Cria novo usuário.

POST /login - Autenticação simples.

Desenvolvido para fins de aprendizado em Full Stack Development.