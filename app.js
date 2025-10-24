const express = require('express');
const app = express(); 
const PORT =2000;

const db = require('./database');

const ToDoModel = require('./models/ToDoModel');

app.use(express.json());

// Rota para obter todas as tarefas
app.get('/tarefas', (req, res) => {
    ToDoModel.getAll((err, tasks) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao recuperar as tarefas.' });
        }   
        res.json(tasks);
    }); 
});

// Rota para criar uma nova tarefa
app.post('/tarefas', (req, res) => {
    const { titulo } = req.body;    
    if (!titulo) {
        return res.status(400).json({ error: 'O campo "titulo" é obrigatório.' });
    }   
    ToDoModel.create(titulo, (err, taskId) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao criar a tarefa.' });
        }   
        res.status(201).json({ id: taskId, titulo, completa: 0 });
    });
});

// Rota para deletar uma tarefa
app.delete('/tarefas/:id', (req, res) => {
    
    const id = req.params.id; 

    ToDoModel.remove(id, (err, changes) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao deletar a tarefa.' });
        }
        
        if (changes === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada.' });
        }
        
        res.status(204).send(); 
    });
});

// Rota para atualizar o título de uma tarefa
app.put('/tarefas/:id', (req, res) => {
    const id = req.params.id;
    const { titulo } = req.body; 

    if (!titulo) {
        return res.status(400).json({ error: 'O campo "titulo" é obrigatório para a edição.' });
    }

    ToDoModel.updateTitle(id, titulo, (err, changes) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao atualizar a tarefa.' });
        }

        if (changes === 0) {
          
            return res.status(404).json({ error: 'Tarefa não encontrada.' });
        }

        
        res.status(200).json({ message: 'Tarefa atualizada com sucesso.' });
    });
});
// Rota para marcar uma tarefa como completa ou incompleta
app.patch('/tarefas/:id', (req, res) => {
    const id = req.params.id;
    const { completa } = req.body;

   if (completa === undefined || (completa !== 0 && completa !== 1)) {
        return res.status(400).json({ error: 'O campo "completa" deve ser 0 (incompleta) ou 1 (completa).' });
    }

    ToDoModel.toggleComplete(id, completa, (err, changes) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao atualizar o status da tarefa.' });
        }

        if (changes === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada.' });
        }

        res.status(200).json({ message: 'Status da tarefa atualizado com sucesso.' });
    });
});


   

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 