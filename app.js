const express = require('express');
const cors = require('cors');
require('dotenv').config(); // + Carregar configs

const app = express();
const PORT = 2000;

// Configurações
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Importações
const TaskController = require('./controllers/TaskController');
const UserController = require('./controllers/UserController');
const authMiddleware = require('./middlewares/auth'); // + Importar Middleware

// --- Rotas Públicas (Login/Register) ---
app.post('/register', UserController.register);
app.post('/login', UserController.login);

// --- Rotas Privadas (Tarefas) ---
// Aplica o middleware em TUDO que for /tarefas
app.use('/tarefas', authMiddleware); 

app.get('/tarefas', TaskController.index);
app.get('/tarefas/concluidas', TaskController.completed);
app.post('/tarefas', TaskController.store);
app.put('/tarefas/:id', TaskController.update);
app.patch('/tarefas/:id', TaskController.patch);
app.delete('/tarefas/:id', TaskController.delete);

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));