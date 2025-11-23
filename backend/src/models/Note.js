const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const noteSchema = new mongoose.Schema({
  _id: { type: String, required: true, default: uuidv4 }, // UUID
  userId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String },
  category: { type: String, enum: ['travail','personnel','urgent'], default: 'personnel' },
  tags: [{ type: String }],
  // Tableau des fichiers attachés à la note
  attachments: [{ 
    filename: String,    // Nom original du fichier
    url: String,         // Chemin d'accès au fichier
    mimeType: String,    // Type MIME (image/png, application/pdf, etc.)
    size: Number         // Taille du fichier en octets
  }],
  color: { type: String }, // couleur hex pour la catégorie
  archived: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
