const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authenticateToken = require('../middlewares/authMiddleware');
const upload = require('../config/multer');

/**
 * @swagger
 * /api/upload/{noteId}:
 *   post:
 *     tags: [Uploads]
 *     summary: Ajoute un ou plusieurs fichiers à une note
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Fichiers ajoutés
 */
router.post(
  '/:noteId',
  authenticateToken,
  upload.array('files', 5),
  uploadController.uploadFiles
);

/**
 * @swagger
 * /api/upload/{noteId}:
 *   get:
 *     tags: [Uploads]
 *     summary: Liste les fichiers attachés à une note
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste d'attachements
 */
router.get(
  '/:noteId',
  authenticateToken,
  uploadController.getFiles
);

/**
 * @swagger
 * /api/upload/{noteId}/{attachmentId}:
 *   delete:
 *     tags: [Uploads]
 *     summary: Supprime un fichier d'une note
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: attachmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fichier supprimé
 */
router.delete(
  '/:noteId/:attachmentId',
  authenticateToken,
  uploadController.deleteFile
);

module.exports = router;
