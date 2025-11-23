const { body, validationResult } = require('express-validator');

// Middleware de validation pour les notes
const validateNote = [
  // Vérifie que le titre est fourni
  body('title')
    .notEmpty().withMessage('Le titre est requis')
    .isString().withMessage('Le titre doit être une chaîne de caractères')
    .trim()
    .isLength({ max: 150 }).withMessage('Le titre doit contenir au maximum 150 caractères'),

  // Vérifie que le contenu (facultatif) est une chaîne si présent
  body('content')
    .optional()
    .isString().withMessage('Le contenu doit être une chaîne'),

  // Catégorie : doit être parmi les valeurs autorisées
  body('category')
    .optional()
    .isIn(['travail', 'personnel', 'urgent'])
    .withMessage('Catégorie invalide (travail, personnel ou urgent uniquement)'),

  // Tags : doit être un tableau de chaînes
  body('tags')
    .optional()
    .isArray().withMessage('tags doit être un tableau')
    .custom(tags => tags.every(tag => typeof tag === 'string'))
    .withMessage('Chaque tag doit être une chaîne'),

  // Attachments : tableau d’objets avec filename, url, mimeType
  body('attachments')
    .optional()
    .isArray().withMessage('attachments doit être un tableau')
    .custom(attachments => attachments.every(a =>
      typeof a.filename === 'string' &&
      typeof a.url === 'string' &&
      typeof a.mimeType === 'string'
    ))
    .withMessage('Chaque attachment doit contenir filename, url et mimeType'),

  // Couleur : facultative, mais si présente, doit être un code hex (#AABBCC)
  body('color')
    .optional()
    .matches(/^#([0-9A-F]{3}){1,2}$/i)
    .withMessage('La couleur doit être un code hex valide (#RRGGBB)'),

  // archived : booléen facultatif
  body('archived')
    .optional()
    .isBoolean()
    .withMessage('archived doit être un booléen'),

  // Gestion des erreurs
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateNote;
