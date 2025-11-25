const db = require('../database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const UserModel = {

    // Gera o hash da senha e insere o novo usuário
    createUser: (email, password, callback) => {
        // Criptografa a senha antes de salvar
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) return callback(err);

            const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
            db.run(sql, [email, hash], function(err) {
                // Retorna o ID do novo usuário criado
                callback(err, this ? this.lastID : null);
            });
        });
    },

    //LOGIN: Busca o usuário pelo e-mail
    findByEmail: (email, callback) => {
        
        db.get("SELECT * FROM users WHERE email = ?", [email], callback);
    },

    //Comparação de Senha 
    comparePassword: (password, hash, callback) => {
        bcrypt.compare(password, hash, callback);
    }
};

module.exports = UserModel;