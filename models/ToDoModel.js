const db = require('../database');

const ToDoModel = {
    // Recupera tarefas pendentes (completa = 0)
    getAll: (callback) => {
        db.all('SELECT * FROM tarefas WHERE completa = 0', (err, rows) => {
            callback(err, rows);
        });
    },

    getCompleted: (callback) => {
        db.all('SELECT * FROM tarefas WHERE completa = 1', (err, rows) => {
            callback(err, rows);
        });
    },

    // Cria nova tarefa
    create: (titulo, callback) => {
        db.run('INSERT INTO tarefas (titulo, completa) VALUES (?, ?)', 
            [titulo, 0], 
            function (err) {
                callback(err, this ? this.lastID : null);
            }
        );
    },

    // Remove tarefa
    remove: (id, callback) => {
        db.run('DELETE FROM tarefas WHERE id = ?', [id], function (err) {
            callback(err, this ? this.changes : 0);
        });
    },

    // Atualiza título
    updateTitle: (id, novoTitulo, callback) => {
        db.run('UPDATE tarefas SET titulo = ? WHERE id = ?', 
            [novoTitulo, id], 
            function(err) {
                callback(err, this ? this.changes : 0);
            }
        );
    },

    // Marca como completa/incompleta
    toggleComplete: (id, completa, callback) => {
        db.run('UPDATE tarefas SET completa = ? WHERE id = ?', 
            [completa, id], 
            function(err) {
                callback(err, this ? this.changes : 0);
            }
        );
    }
};

module.exports = ToDoModel;