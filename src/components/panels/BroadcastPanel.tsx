import React from 'react';
import { FiSend } from 'react-icons/fi';
import { useLanguage } from '../../i18n/LanguageContext';

interface BroadcastPanelProps {
    messageTitle: string;
    setMessageTitle: (value: string) => void;
    messageCategory: string;
    setMessageCategory: (value: string) => void;
    messagePriority: string;
    setMessagePriority: (value: string) => void;
    targetAudience: string;
    setTargetAudience: (value: string) => void;
    broadcastMessage: string;
    setBroadcastMessage: (value: string) => void;
    handleBroadcast: () => void;
    categories: Array<{ id: string; name: string }>;
}

const BroadcastPanel: React.FC<BroadcastPanelProps> = ({
    messageTitle,
    setMessageTitle,
    messageCategory,
    setMessageCategory,
    messagePriority,
    setMessagePriority,
    targetAudience,
    setTargetAudience,
    broadcastMessage,
    setBroadcastMessage,
    handleBroadcast,
    categories
}) => {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col space-y-6">
            <h2 className="text-lg font-medium mb-2">{t("broadcastMessage")}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="mb-4">
                        <label htmlFor="message-category" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                            {t("messageCategory")} <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="message-category"
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            value={messageCategory}
                            onChange={(e) => setMessageCategory(e.target.value)}
                            required
                        >
                            <option value="">{t("selectCategory")}</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="message-priority" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                            {t("messagePriority")} <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="message-priority"
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            value={messagePriority}
                            onChange={(e) => setMessagePriority(e.target.value)}
                            required
                        >
                            <option value="critical">{t("critical")}</option>
                            <option value="high">{t("high")}</option>
                            <option value="medium">{t("medium")}</option>
                            <option value="low">{t("low")}</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="target-audience" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                            {t("targetAudience")}
                        </label>
                        <select
                            id="target-audience"
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                        >
                            <option value="all">{t("allUsers")}</option>
                            <option value="north">{t("northDistrict")}</option>
                            <option value="central">{t("centralDistrict")}</option>
                            <option value="east">{t("eastDistrict")}</option>
                            <option value="emergency">{t("emergencyPersonnel")}</option>
                        </select>
                    </div>
                </div>

                <div>
                    <div className="mb-4">
                        <label htmlFor="message-title" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                            {t("messageTitle")} <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="message-title"
                            type="text"
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder={t("enterMessageTitle")}
                            value={messageTitle}
                            onChange={(e) => setMessageTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4 h-full">
                        <label htmlFor="broadcast-message" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                            {t("messageContent")} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="broadcast-message"
                            className="w-full h-[calc(100%-32px)] min-h-[150px] p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                            placeholder={t("enterYourMessage")}
                            value={broadcastMessage}
                            onChange={(e) => setBroadcastMessage(e.target.value)}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="text-right">
                <button
                    className={`px-4 py-2 rounded-md flex items-center ${!broadcastMessage.trim() || !messageCategory || !messagePriority
                            ? 'bg-purple-300 cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                    onClick={handleBroadcast}
                    disabled={!broadcastMessage.trim() || !messageCategory || !messagePriority}
                >
                    <FiSend className="mr-2" />
                    {t("broadcast")}
                </button>
            </div>
        </div>
    );
};

export default BroadcastPanel;