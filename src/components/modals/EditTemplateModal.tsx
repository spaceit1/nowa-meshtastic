import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import type { Template } from '../../pages/AdminDashboard';
import Modal from '../ui/Modal';

interface EditTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: Template;
    handleTemplateFormChange: (field: string, value: string) => void;
    handleSaveTemplate: () => void;
    categories: string[];
}

const EditTemplateModal: React.FC<EditTemplateModalProps> = ({
    isOpen,
    onClose,
    template,
    handleTemplateFormChange,
    handleSaveTemplate,
    categories
}) => {
    const { t } = useLanguage();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={template?.id.includes("new") ? t("addTemplate") : t("editTemplate") || "Edit Template"}
        >
            <div className="flex flex-col space-y-4">
                <div>
                    <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                        {t("templateName") || "Template Name"} <span className="text-red-500">*</span>
                    </label>
                    <select
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        value={template.name}
                        onChange={(e) => handleTemplateFormChange("name", e.target.value)}
                    >
                        <option value="evacuationAlert">{t("evacuationAlert")}</option>
                        <option value="medicalAidAvailable">{t("medicalAidAvailable")}</option>
                        <option value="powerOutageUpdate">{t("powerOutageUpdate")}</option>
                        <option value="foodDistribution">{t("foodDistribution")}</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                        {t("category")} <span className="text-red-500">*</span>
                    </label>
                    <select
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        value={template.category}
                        onChange={(e) => handleTemplateFormChange("category", e.target.value)}
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {t(category)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                        {t("priority")} <span className="text-red-500">*</span>
                    </label>
                    <select
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        value={template.priority}
                        onChange={(e) => handleTemplateFormChange("priority", e.target.value)}
                    >
                        <option value="critical">{t("critical")}</option>
                        <option value="high">{t("high")}</option>
                        <option value="medium">{t("medium")}</option>
                        <option value="low">{t("low")}</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
                <button
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    onClick={onClose}
                >
                    {t("cancel")}
                </button>
                <button
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                    onClick={handleSaveTemplate}
                >
                    {t("save") || "Save"}
                </button>
            </div>
        </Modal>
    );
};

export default EditTemplateModal;