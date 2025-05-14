import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import type { Template } from '../../pages/AdminDashboard';
import Modal from '../ui/Modal';

interface DeleteTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: Template;
    handleConfirmDelete: () => void;
}

const DeleteTemplateModal: React.FC<DeleteTemplateModalProps> = ({
    isOpen,
    onClose,
    template,
    handleConfirmDelete
}) => {
    const { t } = useLanguage();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t("confirmDelete") || "Confirm Delete"}
            size="sm"
        >
            <p>
                {t("deleteTemplateConfirmation") || "Are you sure you want to delete this template?"}{' '}
                {template && <strong>{t(template.name)}</strong>}
            </p>

            <div className="flex justify-end space-x-3 mt-6">
                <button
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    onClick={onClose}
                >
                    {t("cancel")}
                </button>
                <button
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                    onClick={handleConfirmDelete}
                >
                    {t("delete")}
                </button>
            </div>
        </Modal>
    );
};

export default DeleteTemplateModal;