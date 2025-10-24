const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./todo.db'); 

// Cria a tabela "tarefas" 
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tarefas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      completa BOOLEAN NOT NULL DEFAULT 0
    )
  `);
});

module.exports = db;