import React, { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FileUpload = ({ onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (selectedFile) => {
        setFile(selectedFile);
        setError(null);
        setLoading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao processar arquivo');
            }

            onUploadSuccess(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
            setFile(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            <motion.div
                layout
                className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${isDragging
                        ? 'border-premium-magenta bg-premium-magenta/5 scale-[1.02]'
                        : 'border-premium-border bg-premium-dark/50 hover:border-premium-purple/50'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleChange}
                    accept=".xlsx,.csv"
                    disabled={loading}
                />

                <div className="flex flex-col items-center justify-center text-center gap-4">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex flex-col items-center"
                            >
                                <Loader2 className="w-12 h-12 text-premium-magenta animate-spin mb-2" />
                                <p className="text-premium-light font-medium">Processando Inteligência Artificial...</p>
                                <p className="text-xs text-gray-500">Isso pode levar alguns segundos</p>
                            </motion.div>
                        ) : error ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex flex-col items-center text-red-400"
                            >
                                <AlertCircle className="w-12 h-12 mb-2" />
                                <p className="font-medium">{error}</p>
                                <p className="text-xs text-gray-500 mt-2">Tente novamente</p>
                            </motion.div>
                        ) : file ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex flex-col items-center text-green-400"
                            >
                                <CheckCircle className="w-12 h-12 mb-2" />
                                <p className="font-medium text-premium-light">{file.name}</p>
                                <p className="text-xs text-gray-500">Processado com sucesso!</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex flex-col items-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-premium-magenta/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <Upload className="w-8 h-8 text-premium-magenta" />
                                </div>
                                <h3 className="text-lg font-bold text-premium-light">
                                    Arraste sua planilha ou clique aqui
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    Suporta arquivos .xlsx e .csv
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default FileUpload;
