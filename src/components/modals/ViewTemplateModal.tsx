import React from 'react';
import { FiSend } from 'react-icons/fi';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import Modal from '../ui/Modal.tsx';

interface ViewTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    templateContent: {
        name?: string;
        content?: string;
        id?: string;
        category?: string;
        priority?: string;
    };
    editingTemplateContent: string;
    setEditingTemplateContent: (content: string) => void;
    handleSaveTemplateContent: () => void;
    handleSendTemplate: () => void;
}

const ViewTemplateModal: React.FC<ViewTemplateModalProps> = ({
    isOpen,
    onClose,
    templateContent,
    editingTemplateContent,
    setEditingTemplateContent,
    handleSaveTemplateContent,
    handleSendTemplate
}) => {
    const { t } = useLanguage();

    const getPriorityColor = (priority?: string): string => {
        switch (priority) {
            case "critical":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            case "high":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
            case "medium":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
            case "low":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={templateContent.name || ""}
        >
            <div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                        {t("messageContent") || "Message Content"}
                    </label>
                    <textarea
                        className="w-full min-h-[150px] p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        value={editingTemplateContent}
                        onChange={(e) => setEditingTemplateContent(e.target.value)}
                    />
                </div>

                {/* Display template metadata */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="font-bold">{t("category")}:</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(templateContent.category)}`}>
                            {templateContent.category ? t(templateContent.category) : ""}
                        </span>
                    </div>
                    <div>
                        <p className="font-bold">{t("priority")}:</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(templateContent.priority)}`}>
                            {templateContent.priority ? t(templateContent.priority) : ""}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
                <button
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    onClick={onClose}
                >
                    {t("cancel") || "Cancel"}
                </button>
                <button
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                    onClick={handleSaveTemplateContent}
                >
                    {t("save") || "Save"}
                </button>
                <button
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center"
                    onClick={handleSendTemplate}
                >
                    <FiSend className="mr-2" />
                    {t("send") || "Send"}
                </button>
            </div>
        </Modal>
    );
};

export default ViewTemplateModal;