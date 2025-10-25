const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./todo.db'); 

// Cria a tabela "tarefas" e executa a migração (ALTER TABLE)
db.serialize(() => {
  
    db.run(`
        CREATE TABLE IF NOT EXISTS tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            completa BOOLEAN NOT NULL DEFAULT 0,
            -- Adiciona a coluna 'prioridade' se não existir ainda.
            -- Se for a primeira vez que você roda, ela será criada aqui.
            prioridade TEXT NOT NULL DEFAULT 'Baixa'
        )
    `);

    db.run("ALTER TABLE tarefas ADD COLUMN prioridade TEXT NOT NULL DEFAULT 'Baixa'", (err) => {
    
        if (err && !err.message.includes('duplicate column name')) {
            console.error("Erro desconhecido durante a migração:", err.message);
        } else if (!err) {
            console.log(" Coluna 'prioridade' adicionada com sucesso à tabela 'tarefas'.");
        }
    });

    console.log('Estrutura do Banco de Dados SQLite verificada.');
});

module.exports = db;