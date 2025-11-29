const ToDoModel = require('../models/ToDoModel');

module.exports = {
    index: (req, res) => {
        ToDoModel.getAll((err, tasks) => {
            if (err) return res.status(500).json({ error: 'Erro no banco.' });
            res.json(tasks);
        });
    },

    completed: (req, res) => {
        ToDoModel.getCompleted((err, tasks) => {
            if (err) return res.status(500).json({ error: 'Erro no banco.' });
            res.json(tasks);
        });
    },

    store: (req, res) => {
        const { titulo } = req.body;
        if (!titulo) return res.status(400).json({ error: 'Título obrigatório.' });

        ToDoModel.create(titulo, (err, id) => {
            if (err) return res.status(500).json({ error: 'Erro ao criar.' });
            res.status(201).json({ id, titulo, completa: 0 });
        });
    },

    delete: (req, res) => {
        ToDoModel.remove(req.params.id, (err, changes) => {
            if (err) return res.status(500).json({ error: 'Erro ao deletar.' });
            if (!changes) return res.status(404).json({ error: 'Não encontrado.' });
            res.status(204).send();
        });
    },

    update: (req, res) => {
        const { titulo } = req.body;
        if (!titulo) return res.status(400).json({ error: 'Título obrigatório.' });

        ToDoModel.updateTitle(req.params.id, titulo, (err, changes) => {
            if (err) return res.status(500).json({ error: 'Erro ao atualizar.' });
            if (!changes) return res.status(404).json({ error: 'Não encontrado.' });
            res.json({ message: 'Atualizado.' });
        });
    },

    patch: (req, res) => {
        const { completa } = req.body;
        if (completa !== 0 && completa !== 1) return res.status(400).json({ error: 'Status inválido.' });

        ToDoModel.toggleComplete(req.params.id, completa, (err, changes) => {
            if (err) return res.status(500).json({ error: 'Erro ao atualizar.' });
            if (!changes) return res.status(404).json({ error: 'Não encontrado.' });
            res.json({ message: 'Status atualizado.' });
        });
    }
};