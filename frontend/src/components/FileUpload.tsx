import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { FiUpload, FiFile, FiImage, FiFileText, FiX, FiEye, FiDownload, FiExternalLink } from 'react-icons/fi';
import type { Attachment } from '../types/note';

interface FileUploadProps {
    noteId?: string;
    existingAttachments?: Attachment[];
    onUpload: (files: FileList) => Promise<void>;
    onDelete: (attachmentId: string) => Promise<void>;
    maxFiles?: number;
    maxSizeInMB?: number;
}

const ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
];

export function FileUpload({
    existingAttachments = [],
    onUpload,
    onDelete,
    maxFiles = 5,
    maxSizeInMB = 10
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [viewingImage, setViewingImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFiles = (files: FileList): string | null => {
        if (files.length > maxFiles) {
            return `Maximum ${maxFiles} fichiers autorisés par upload`;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (!ALLOWED_TYPES.includes(file.type)) {
                return `Type de fichier non autorisé: ${file.name}`;
            }

            if (file.size > maxSizeInMB * 1024 * 1024) {
                return `Fichier trop volumineux: ${file.name} (max ${maxSizeInMB}MB)`;
            }
        }

        return null;
    };

    const handleFiles = async (files: FileList) => {
        setError(null);

        const validationError = validateFiles(files);
        if (validationError) {
            setError(validationError);
            return;
        }

        setUploading(true);
        try {
            await onUpload(files);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Erreur lors de l'upload");
        } finally {
            setUploading(false);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return FiImage;
        if (mimeType === 'application/pdf') return FiFileText;
        return FiFile;
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getFileUrl = (url: string) => {
        return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${url}`;
    };

    const isImage = (mimeType: string) => mimeType.startsWith('image/');

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
                        ? 'border-primary bg-blue-50 dark:bg-blue-900/20 scale-[1.02]'
                        : 'border-slate-300 dark:border-slate-600 hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={ALLOWED_TYPES.join(',')}
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <div className="flex flex-col items-center gap-3">
                    <div className={`
            p-4 rounded-full transition-colors
            ${isDragging
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }
          `}>
                        {uploading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current" />
                        ) : (
                            <FiUpload className="w-6 h-6" />
                        )}
                    </div>

                    <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {uploading ? 'Upload en cours...' : 'Glissez vos fichiers ici ou cliquez pour sélectionner'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Max {maxFiles} fichiers, {maxSizeInMB}MB chacun
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            Images, PDF, Word, Excel, TXT
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            {/* Existing Attachments */}
            {existingAttachments.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Pièces jointes ({existingAttachments.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {existingAttachments.map((attachment) => {
                            const Icon = getFileIcon(attachment.mimeType);
                            const fileUrl = getFileUrl(attachment.url);
                            const isImg = isImage(attachment.mimeType);

                            return (
                                <div
                                    key={attachment._id}
                                    className="relative group bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-primary dark:hover:border-primary transition-all overflow-hidden"
                                >
                                    {/* Image Preview */}
                                    {isImg ? (
                                        <div
                                            className="relative aspect-video bg-slate-100 dark:bg-slate-800 cursor-pointer"
                                            onClick={() => setViewingImage(fileUrl)}
                                        >
                                            <img
                                                src={fileUrl}
                                                alt={attachment.filename}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                                <FiEye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                                            <Icon className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                                        </div>
                                    )}

                                    {/* File Info */}
                                    <div className="p-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                                                    {attachment.filename}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                    {formatFileSize(attachment.size)}
                                                </p>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-1">
                                                {isImg ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => setViewingImage(fileUrl)}
                                                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                        title="Voir l'image"
                                                    >
                                                        <FiEye className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <a
                                                        href={fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                        title="Ouvrir le fichier"
                                                    >
                                                        <FiExternalLink className="w-4 h-4" />
                                                    </a>
                                                )}
                                                <a
                                                    href={fileUrl}
                                                    download={attachment.filename}
                                                    className="p-1.5 text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                                                    title="Télécharger"
                                                >
                                                    <FiDownload className="w-4 h-4" />
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => attachment._id && onDelete(attachment._id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <FiX className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Image Viewer Modal */}
            {viewingImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setViewingImage(null)}
                >
                    <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
                        <img
                            src={viewingImage}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            onClick={() => setViewingImage(null)}
                            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
                        >
                            <FiX className="w-6 h-6" />
                        </button>
                        <a
                            href={viewingImage}
                            download
                            className="absolute bottom-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
                            title="Télécharger"
                        >
                            <FiDownload className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
