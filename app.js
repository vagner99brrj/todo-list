const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 2000;

// Configurações
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Importação dos Controllers
const TaskController = require('./controllers/TaskController');
const UserController = require('./controllers/UserController');

// --- Rotas de Tarefas ---
app.get('/tarefas', TaskController.index);
app.get('/tarefas/concluidas', TaskController.completed);
app.post('/tarefas', TaskController.store);
app.put('/tarefas/:id', TaskController.update);
app.patch('/tarefas/:id', TaskController.patch);
app.delete('/tarefas/:id', TaskController.delete);

// --- Rotas de Usuário ---
app.post('/register', UserController.register);
app.post('/login', UserController.login); // Nova rota funcional

// Inicialização
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));