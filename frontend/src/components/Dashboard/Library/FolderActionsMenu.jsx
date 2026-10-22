import React, { useState, useRef } from 'react';
import { EllipsisVertical, Pencil, Trash2, AlertTriangle, X } from 'lucide-react';
import { folderService } from '../../../services/folderService';

export default function FolderActionsMenu({ folder, onUpdateSuccess, onDeleteSuccess }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [menuPosition, setMenuPosition] = useState('bottom');

    const [confirmName, setConfirmName] = useState('');

    const [editData, setEditData] = useState({
        name: folder.name || folder.nome || '',
        description: folder.description || folder.descricao || ''
    });

    const buttonRef = useRef(null);

    const handleToggleMenu = (e) => {
        e.stopPropagation();
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            setMenuPosition(spaceBelow < 160 ? 'top' : 'bottom');
        }
        setIsOpen(!isOpen);
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        setIsOpen(false);
        setIsEditOpen(true);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setConfirmName('');
        setIsOpen(false);
        setIsDeleteOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setIsProcessing(true);
            const updatedFolder = await folderService.updateFolder(folder.id, editData);
            setIsEditOpen(false);
            if (onUpdateSuccess) onUpdateSuccess(updatedFolder);
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar pasta.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirmDelete = async () => {
        const folderActualName = folder.name || folder.nome;
        if (confirmName !== folderActualName) return;

        try {
            setIsProcessing(true);
            await folderService.deleteFolder(folder.id);
            setIsDeleteOpen(false);
            if (onDeleteSuccess) onDeleteSuccess(folder.id);
        } catch (error) {
            console.error(error);
            alert('Erro ao excluir pasta.');
        } finally {
            setIsProcessing(false);
        }
    };

    const folderNameString = folder.name || folder.nome || '';

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={handleToggleMenu}
                className={`p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all relative z-20 ${isOpen ? 'bg-slate-100' : ''}`}
            >
                <EllipsisVertical className="w-5 h-5" />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className={`absolute right-0 w-48 bg-white/95 backdrop-blur-sm border border-slate-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] py-1.5 z-30 animate-fade-in
            ${menuPosition === 'top' ? 'bottom-full mb-2 origin-bottom-right' : 'top-full mt-2 origin-top-right'}`}
                    >
                        <button
                            onClick={handleEditClick}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-2.5 transition-colors font-medium"
                        >
                            <Pencil className="w-4 h-4 text-slate-400" />
                            Editar detalhes
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2.5 transition-colors font-medium"
                        >
                            <Trash2 className="w-4 h-4 text-red-400" />
                            Excluir pasta
                        </button>
                    </div>
                </>
            )}

            {isEditOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-60" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-scale-in">
                        <header className="p-6 border-b border-slate-50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 text-lg">Editar Pasta</h3>
                            <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </header>
                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nome da Pasta</label>
                                <input
                                    autoFocus
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                    value={editData.name}
                                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Descrição (opcional)</label>
                                <textarea
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none h-24"
                                    value={editData.description}
                                    onChange={e => setEditData({ ...editData, description: e.target.value })}
                                />
                            </div>
                            <footer className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditOpen(false)}
                                    className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-md shadow-emerald-100 transition-all disabled:opacity-50"
                                >
                                    {isProcessing ? 'Salvando...' : 'Salvar Alterações'}
                                </button>
                            </footer>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-60" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-scale-in p-6 md:p-8">
                        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4 border border-red-100">
                            <AlertTriangle className="w-7 h-7" />
                        </div>

                        <h4 className="text-xl font-extrabold text-slate-800 tracking-tight">Excluir pasta permanentemente?</h4>

                        <p className="text-sm text-red-600 font-medium bg-red-50/50 border border-red-100 p-3 rounded-xl mt-3 leading-relaxed">
                            <strong>Atenção:</strong> Esta ação é irreversível. Todos os quizzes armazenados dentro desta pasta <strong>também serão apagados definitivamente</strong>.
                        </p>

                        <div className="mt-5 space-y-4">
                            <p className="text-sm text-slate-500">
                                Para confirmar, digite o nome da pasta <strong className="text-slate-800 select-all">"{folderNameString}"</strong> abaixo:
                            </p>

                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm font-medium"
                                placeholder="Digite o nome da pasta para confirmar"
                                value={confirmName}
                                onChange={(e) => setConfirmName(e.target.value)}
                            />
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setIsDeleteOpen(false)}
                                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                disabled={isProcessing || confirmName !== folderNameString}
                                onClick={handleConfirmDelete}
                                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-md disabled:opacity-30 disabled:hover:bg-red-600 disabled:shadow-none transition-all text-sm"
                            >
                                {isProcessing ? 'Excluindo...' : 'Excluir de Vez'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}