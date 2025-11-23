const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const authenticateToken = require('../middlewares/authMiddleware');
const validateNote = require('../middlewares/noteValidation');

/**
 * @swagger
 * /api/notes:
 *   get:
 *     tags: [Notes]
 *     summary: Liste les notes de l'utilisateur connecté avec filtres/recherche
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [travail, personnel, urgent]
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Liste de notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 */
router.get('/', authenticateToken, notesController.getNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     tags: [Notes]
 *     summary: Récupère une note par son identifiant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note trouvée
 *       404:
 *         description: Note introuvable
 */
router.get('/:id', authenticateToken, notesController.getNoteById);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     tags: [Notes]
 *     summary: Met à jour une note existante
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NoteInput'
 *     responses:
 *       200:
 *         description: Note mise à jour
 *       404:
 *         description: Note introuvable
 */
router.put('/:id', authenticateToken, validateNote, notesController.updateNote);

/**
 * @swagger
 * /api/notes:
 *   post:
 *     tags: [Notes]
 *     summary: Crée une nouvelle note
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NoteInput'
 *     responses:
 *       201:
 *         description: Note créée
 */
router.post('/', authenticateToken, validateNote, notesController.createNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     tags: [Notes]
 *     summary: Supprime une note
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note supprimée
 *       404:
 *         description: Note introuvable
 */
router.delete('/:id', authenticateToken, notesController.deleteNote);

module.exports = router;