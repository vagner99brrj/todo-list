const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });

    try {
        // Remove 'Bearer ' se vier no header e verifica
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.userId = decoded.id; // Salva o ID do usuário para uso futuro
        next();
    } catch (err) {
        res.status(400).json({ error: 'Token inválido.' });
    }
};