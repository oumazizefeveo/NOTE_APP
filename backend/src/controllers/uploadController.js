const Note = require('../models/Note');
const path = require('path');
const fs = require('fs');

const MAX_ATTACHMENTS_PER_NOTE = parseInt(process.env.MAX_ATTACHMENTS_PER_NOTE || '10', 10);

/**
 * Upload un ou plusieurs fichiers et les attache à une note
 * @route POST /api/upload/:noteId
 * @access Private (nécessite authentification)
 */
exports.uploadFiles = async (req, res) => {
  try {
    // Vérifier si des fichiers ont été uploadés
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const { noteId } = req.params;

    // Vérifier que la note existe et appartient à l'utilisateur
    const note = await Note.findOne({ _id: noteId, userId: req.user.id });
    if (!note) {
      // Supprimer les fichiers uploadés si la note n'existe pas
      req.files.forEach(file => {
        fs.unlinkSync(file.path);
      });
      return res.status(404).json({ error: 'Note introuvable' });
    }

    // Créer les objets d'attachement pour chaque fichier
    const attachments = req.files.map(file => ({
      filename: file.originalname, // Nom original du fichier
      url: `/uploads/${file.filename}`, // URL relative pour accéder au fichier
      mimeType: file.mimetype, // Type MIME (image/png, application/pdf, etc.)
      size: file.size // Taille du fichier en octets
    }));

    // Vérifier le quota d'attachements
    if (note.attachments.length + attachments.length > MAX_ATTACHMENTS_PER_NOTE) {
      // Nettoyer les fichiers venant d'être uploadés
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });

      return res.status(400).json({
        error: 'Quota de pièces jointes atteint',
        details: `Maximum ${MAX_ATTACHMENTS_PER_NOTE} fichiers par note`
      });
    }

    // Ajouter les nouveaux attachements à la note existante
    note.attachments.push(...attachments);
    await note.save();

    // Retourner la note mise à jour avec les nouveaux fichiers
    res.status(200).json({
      message: 'Fichiers uploadés avec succès',
      attachments: attachments,
      note: note
    });

  } catch (err) {
    // En cas d'erreur, supprimer les fichiers uploadés pour éviter les orphelins
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    res.status(500).json({ 
      error: "Erreur lors de l'upload des fichiers", 
      details: err.message 
    });
  }
};

/**
 * Supprime un fichier attaché à une note
 * @route DELETE /api/upload/:noteId/:attachmentId
 * @access Private (nécessite authentification)
 */
exports.deleteFile = async (req, res) => {
  try {
    const { noteId, attachmentId } = req.params;

    // Trouver la note qui appartient à l'utilisateur
    const note = await Note.findOne({ _id: noteId, userId: req.user.id });
    if (!note) {
      return res.status(404).json({ error: 'Note introuvable' });
    }

    // Trouver l'attachement dans la note
    const attachmentIndex = note.attachments.findIndex(
      att => att._id.toString() === attachmentId
    );

    if (attachmentIndex === -1) {
      return res.status(404).json({ error: 'Fichier introuvable' });
    }

    // Récupérer le chemin du fichier sur le disque
    const attachment = note.attachments[attachmentIndex];
    const filePath = path.join(__dirname, '../../uploads', path.basename(attachment.url));

    // Supprimer le fichier physique du serveur
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Retirer l'attachement du tableau dans la note
    note.attachments.splice(attachmentIndex, 1);
    await note.save();

    res.json({ 
      message: 'Fichier supprimé avec succès',
      note: note
    });

  } catch (err) {
    res.status(500).json({ 
      error: "Erreur lors de la suppression du fichier", 
      details: err.message 
    });
  }
};

/**
 * Récupère la liste des fichiers d'une note
 * @route GET /api/upload/:noteId
 * @access Private (nécessite authentification)
 */
exports.getFiles = async (req, res) => {
  try {
    const { noteId } = req.params;

    // Trouver la note avec ses attachements
    const note = await Note.findOne({ _id: noteId, userId: req.user.id });
    if (!note) {
      return res.status(404).json({ error: 'Note introuvable' });
    }

    // Retourner uniquement les attachements
    res.json({
      noteId: note._id,
      attachments: note.attachments
    });

  } catch (err) {
    res.status(500).json({ 
      error: "Erreur lors de la récupération des fichiers", 
      details: err.message 
    });
  }
};
