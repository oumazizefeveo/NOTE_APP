const { body, validationResult } = require('express-validator');

const validateUser = [
  // Email : requis, format email valide
  body('email')
    .notEmpty().withMessage('L’email est requis')
    .isEmail().withMessage('Format d’email invalide'),

  // Mot de passe : requis, au moins 6 caractères (tu peux ajuster la règle)
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),

  // Gestion des erreurs
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateUser;
