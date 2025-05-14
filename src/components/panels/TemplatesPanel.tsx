import React from 'react';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { useLanguage } from '../../i18n/LanguageContext';
import type { Template } from '../../pages/AdminDashboard';

interface TemplatesPanelProps {
  templates: Template[];
  handleAddNewTemplate: () => void;
  handleViewTemplate: (template: Template) => void;
  handleEditTemplate: (template: Template) => void;
  handleDeleteTemplate: (template: Template) => void;
}

const TemplatesPanel: React.FC<TemplatesPanelProps> = ({
  templates,
  handleAddNewTemplate,
  handleViewTemplate,
  handleEditTemplate,
  handleDeleteTemplate
}) => {
  const { t } = useLanguage();

  const getPriorityColor = (priority: string): string => {
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
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium">{t("messageTemplates")}</h2>
        <button
          className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center"
          onClick={handleAddNewTemplate}
        >
          <FiPlus className="mr-1" />
          {t("addTemplate")}
        </button>
      </div>

      {templates.length > 0 ? (
        templates.map((template) => (
          <div
            key={template.id}
            className="border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleViewTemplate(template)}
          >
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <p className="font-bold">{t(template.name)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("category")}: {t(template.category)}
                  </p>
                </div>
                <div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(template.priority)}`}>
                    {t(template.priority)}
                  </span>
                </div>
                <div>
                  <p className="text-sm">
                    {t("usedTimes", { count: template.usageCount })}
                  </p>
                </div>
                <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="px-3 py-1 text-sm border border-blue-500 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTemplate(template);
                    }}
                  >
                    {t("edit")}
                  </button>
                  <button
                    className="px-3 py-1 text-sm text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTemplate(template);
                    }}
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-6 text-center border border-gray-200 dark:border-gray-700 rounded-md">
          <h3 className="text-lg font-medium mb-2">
            {t("noTemplates") || "No Templates"}
          </h3>
          <p>
            {t("noTemplatesDesc") || 'There are no message templates defined yet. Click "Add Template" to create one.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TemplatesPanel;