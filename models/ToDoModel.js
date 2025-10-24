const db = require('../database');

const ToDoModel = {

    //Recupera todas as tarefas 
    getAll: (callback) => {
        
        db.all('SELECT * FROM tarefas', (err, rows) => {
            callback(err, rows);
        });
    }, 

    // Cria uma nova tarefa 
    create: (titulo, callback) => {

        db.run('INSERT INTO tarefas (titulo, completa) VALUES (?, ?)',
            [titulo, 0],
            function (err) {
                callback(err, this ? this.lastID : null);
            }
        );
    }, 

    // Remove uma tarefa 
    remove: (id, callback) => {
        
        db.run('DELETE FROM tarefas WHERE id = ?', [id], function (err) {
            callback(err, this ? this.changes : 0); 

        });
    } ,

    //Editar o título
    updateTitle: (id, novoTitulo, callback) => {

        db.run('UPDATE tarefas SET titulo = ? WHERE id = ?', 
          [novoTitulo, id], 
          function(err) {
            callback(err, this ? this.changes : 0); 
          }
        );
    } ,

    //Marcar como completa/incompleta
    toggleComplete: (id, completa, callback) => {

        db.run('UPDATE tarefas SET completa = ? WHERE id = ?', 
          [completa ? 1 : 0, id], 
          function(err) {
            callback(err, this ? this.changes : 0); 
          }
        );  
    }   
}; 

module.exports = ToDoModel;
   