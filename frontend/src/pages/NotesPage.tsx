import { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { api, uploadAPI } from '../lib/api';
import type { Note, NoteInput, Category } from '../types/note';
import { FiPlus, FiTrash2, FiEdit2, FiSearch, FiFilter, FiPaperclip } from 'react-icons/fi';
import classNames from 'classnames';
import { FileUpload } from '../components/FileUpload';

export function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<Category | ''>('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState<Partial<NoteInput> & { _id?: string }>({});
    const [editorContent, setEditorContent] = useState('');
    const [isNewNote, setIsNewNote] = useState(false);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (search) params.search = search;
            if (categoryFilter) params.category = categoryFilter;

            const res = await api.get<Note[]>('/notes', { params });
            setNotes(res.data);
        } catch (err) {
            console.error("Erreur chargement notes", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchNotes();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [search, categoryFilter]);

    const handleDelete = async (id: string) => {
        if (!confirm('Supprimer cette note ?')) return;
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter(n => n._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...currentNote,
                content: editorContent,
                category: currentNote.category || 'personnel'
            };

            if (currentNote._id && !isNewNote) {
                // Update existing note
                const res = await api.put<Note>(`/notes/${currentNote._id}`, payload);
                setNotes(notes.map(n => n._id === currentNote._id ? res.data : n));
                setIsModalOpen(false);
            } else {
                // Create new note
                const res = await api.post<Note>('/notes', payload);
                setNotes([res.data, ...notes]);
                // Keep modal open with the new note ID for file uploads
                setCurrentNote(res.data);
                setIsNewNote(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const openModal = (note?: Note) => {
        if (note) {
            setCurrentNote(note);
            setEditorContent(note.content || '');
            setIsNewNote(false);
        } else {
            setCurrentNote({ title: '', category: 'personnel' });
            setEditorContent('');
            setIsNewNote(true);
        }
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Mes Notes</h1>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <FiPlus className="w-5 h-5" /> Nouvelle Note
                </button>
            </header>

            <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input pl-10"
                    />
                </div>

                <div className="relative min-w-[200px]">
                    <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value as Category | '')}
                        className="input pl-10 appearance-none"
                    >
                        <option value="">Toutes les catégories</option>
                        <option value="travail">Travail</option>
                        <option value="personnel">Personnel</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-slate-500">Chargement des notes...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map(note => (
                        <div key={note._id} className="card hover:shadow-md transition-shadow flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1">{note.title}</h3>
                                <span className={classNames(
                                    'px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                                    {
                                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300': note.category === 'travail',
                                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': note.category === 'personnel',
                                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': note.category === 'urgent',
                                    }
                                )}>
                                    {note.category}
                                </span>
                            </div>

                            <div
                                className="prose dark:prose-invert prose-sm mb-4 flex-1 line-clamp-4 text-slate-600 dark:text-slate-300"
                                dangerouslySetInnerHTML={{ __html: note.content || '' }}
                            />

                            {/* Attachments indicator */}
                            {note.attachments && note.attachments.length > 0 && (
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
                                    <FiPaperclip className="w-3.5 h-3.5" />
                                    <span>{note.attachments.length} pièce{note.attachments.length > 1 ? 's' : ''} jointe{note.attachments.length > 1 ? 's' : ''}</span>
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-700 mt-auto">
                                <button
                                    onClick={() => openModal(note)}
                                    className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                >
                                    <FiEdit2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(note._id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <FiTrash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {notes.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                            <p className="text-slate-500 dark:text-slate-400">Aucune note trouvée.</p>
                            <button className="btn btn-primary mt-4" onClick={() => openModal()}>
                                <FiPlus className="w-5 h-5" /> Créer une première note
                            </button>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {currentNote._id ? 'Modifier' : 'Créer'} une note
                            </h2>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Titre
                                </label>
                                <input
                                    className="input"
                                    value={currentNote.title || ''}
                                    onChange={e => setCurrentNote({ ...currentNote, title: e.target.value })}
                                    required
                                    placeholder="Titre de la note"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Catégorie
                                </label>
                                <select
                                    className="input"
                                    value={currentNote.category || 'personnel'}
                                    onChange={e => setCurrentNote({ ...currentNote, category: e.target.value as Category })}
                                >
                                    <option value="travail">Travail</option>
                                    <option value="personnel">Personnel</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Contenu
                                </label>
                                <div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
                                    <Editor
                                        tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/7.6.0/tinymce.min.js"
                                        licenseKey='gpl'
                                        value={editorContent}
                                        onEditorChange={(content) => setEditorContent(content)}
                                        init={{
                                            height: 300,
                                            menubar: false,
                                            plugins: [
                                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                            ],
                                            toolbar: 'undo redo | blocks | ' +
                                                'bold italic forecolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat | help',
                                            content_style: 'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:14px }',
                                            skin: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oxide-dark' : 'oxide',
                                            content_css: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* File Upload Section */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Pièces jointes
                                </label>
                                {currentNote._id ? (
                                    <FileUpload
                                        noteId={currentNote._id}
                                        existingAttachments={notes.find(n => n._id === currentNote._id)?.attachments || []}
                                        onUpload={async (files) => {
                                            await uploadAPI.uploadFiles(currentNote._id!, files);
                                            await fetchNotes();
                                            // Update current note with new attachments
                                            const updatedNote = await api.get<Note>(`/notes/${currentNote._id}`);
                                            setCurrentNote(updatedNote.data);
                                        }}
                                        onDelete={async (attachmentId) => {
                                            await uploadAPI.deleteAttachment(currentNote._id!, attachmentId);
                                            await fetchNotes();
                                            // Update current note after deletion
                                            const updatedNote = await api.get<Note>(`/notes/${currentNote._id}`);
                                            setCurrentNote(updatedNote.data);
                                        }}
                                    />
                                ) : (
                                    <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 text-center">
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            💡 Enregistrez d'abord la note pour pouvoir ajouter des fichiers
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {currentNote._id && !isNewNote ? 'Enregistrer' : 'Créer la note'}
                                </button>
                                {currentNote._id && (
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="btn btn-primary"
                                    >
                                        Terminer
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
