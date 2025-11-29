const UserModel = require('../models/UserModel');

module.exports = {
    register: (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Dados incompletos.' });

        UserModel.findByEmail(email, (err, user) => {
            if (err) return res.status(500).json({ error: 'Erro interno.' });
            if (user) return res.status(409).json({ error: 'Email já existe.' });

            UserModel.createUser(email, password, (err, id) => {
                if (err) return res.status(500).json({ error: 'Erro ao criar.' });
                res.status(201).json({ id, email, message: 'Criado com sucesso.' });
            });
        });
    },

    login: (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Dados incompletos.' });

        UserModel.findByEmail(email, (err, user) => {
            if (err) return res.status(500).json({ error: 'Erro interno.' });
            if (!user) return res.status(401).json({ error: 'Credenciais inválidas.' });

            UserModel.comparePassword(password, user.password, (err, isMatch) => {
                if (err) return res.status(500).json({ error: 'Erro ao verificar senha.' });
                if (!isMatch) return res.status(401).json({ error: 'Credenciais inválidas.' });
                
                res.json({ id: user.id, email: user.email, message: 'Login realizado.' });
            });
        });
    }
};