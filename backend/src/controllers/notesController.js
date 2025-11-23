const Note = require('../models/Note');

// ✅ Recherche + filtre + tri
exports.getNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, category, sort } = req.query;

    let query = { userId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    let sortOption = {};
    if (sort === 'asc') sortOption.createdAt = 1;
    else if (sort === 'desc') sortOption.createdAt = -1;

    const notes = await Note.find(query).sort(sortOption);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des notes", details: err.message });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ userId: req.user.id, _id: req.params.id });
    if (!note) return res.status(404).json({ error: "Note introuvable" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération de la note", details: err.message });
  }
};

exports.createNote = async (req, res) => {
  try {
    const note = await Note.create({ ...req.body, userId: req.user.id });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: "Erreur lors de la création", details: err.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { id, userId, ...updateNote } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateNote,
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ error: "Note introuvable" });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: "Erreur lors de la mise à jour", details: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ error: "Note introuvable" });
    res.json({ message: "Note supprimée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression", details: err.message });
  }
};
