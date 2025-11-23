// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Même clé secrète utilisée pour signer les tokens
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET non défini dans les variables d\'environnement');
}

function authenticateToken(req, res, next) {
  // Récupère l’en-tête Authorization (ex: "Bearer eyJhbGciOi...")
  const authHeader = req.headers['authorization'];

  // Sépare "Bearer" du token
  const token = authHeader && authHeader.split(' ')[1];

  // Si aucun token n’est fourni → accès refusé
  if (!token) {
    return res.status(401).json({ error: "Token manquant, accès refusé." });
  }

  // Vérifie la validité du token JWT
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token invalide ou expiré." });
    }

    // Si tout est bon, on ajoute les infos du user dans req.user
    req.user = user;

    // Passe à la suite (contrôleur)
    next();
  });
}

module.exports = authenticateToken;
