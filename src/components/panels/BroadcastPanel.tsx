import React, { useState, useEffect } from 'react';
import { FiSend, FiFileText, FiLoader } from 'react-icons/fi';
import { useLanguage } from '../../i18n/LanguageContext';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import type { BadgeVariant } from '../ui/Badge';

interface Template {
  id: string;
  name_pl: string;
  content_pl: string;
  category_id: string;
  priority: string;
}

interface Category {
  id: string;
  name_pl: string;
  name_en: string;
  name_uk: string;
  name_ru: string;
}

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
}) => {
    const { t } = useLanguage();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedPriority, setSelectedPriority] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (isTemplatesModalOpen) {
            fetchTemplates();
        }
    }, [isTemplatesModalOpen]);

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name_pl');

            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            toast.error(t('errorFetchingCategories'));
            console.error('Error fetching categories:', error);
        }
    };

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('templates')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTemplates(data || []);
        } catch (error) {
            toast.error(t('errorFetchingTemplates'));
            console.error('Error fetching templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTemplates = templates.filter(template =>
        (template.name_pl.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.content_pl.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (!selectedCategory || template.category_id === selectedCategory) &&
        (!selectedPriority || template.priority === selectedPriority)
    );

    const handleTemplateSelect = (template: Template) => {
        setMessageTitle(template.name_pl);
        setBroadcastMessage(template.content_pl);
        setMessageCategory(template.category_id);
        setMessagePriority(template.priority);
        setIsTemplatesModalOpen(false);
        toast.success(t('templateLoaded'));
    };

    const getPriorityColor = (priority: string): BadgeVariant => {
        switch (priority) {
            case "critical":
                return "red";
            case "high":
                return "orange";
            case "medium":
                return "blue";
            case "low":
                return "green";
            default:
                return "gray";
        }
    };

    const priorityOptions = [
        { value: 'critical', label: t('critical') },
        { value: 'high', label: t('high') },
        { value: 'medium', label: t('medium') },
        { value: 'low', label: t('low') }
    ];

    const audienceOptions = [
        { value: 'all', label: t('allUsers') },
        { value: 'north', label: t('northDistrict') },
        { value: 'central', label: t('centralDistrict') },
        { value: 'east', label: t('eastDistrict') },
        { value: 'emergency', label: t('emergencyPersonnel') }
    ];

    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.name_pl
    }));

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t("broadcastMessage")}</h2>
                <Button
                    variant="secondary"
                    size="sm"
                    icon={FiFileText}
                    onClick={() => setIsTemplatesModalOpen(true)}
                >
                    {t('loadTemplate')}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="mb-4">
                        <Select
                            options={categoryOptions}
                            value={messageCategory}
                            onChange={setMessageCategory}
                            label={t("messageCategory")}
                            placeholder={t("selectCategory")}
                            required
                            searchable
                        />
                    </div>

                    <div className="mb-4">
                        <Select
                            options={priorityOptions}
                            value={messagePriority}
                            onChange={setMessagePriority}
                            label={t("messagePriority")}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <Select
                            options={audienceOptions}
                            value={targetAudience}
                            onChange={setTargetAudience}
                            label={t("targetAudience")}
                        />
                    </div>
                </div>

                <div>
                    <div className="mb-4">
                        <Input
                            id="message-title"
                            type="text"
                            value={messageTitle}
                            onChange={(e) => setMessageTitle(e.target.value)}
                            label={t("messageTitle")}
                            placeholder={t("enterMessageTitle")}
                            required
                        />
                    </div>

                    <div className="mb-4 h-full">
                        <Textarea
                            id="broadcast-message"
                            value={broadcastMessage}
                            onChange={(e) => setBroadcastMessage(e.target.value)}
                            label={t("messageContent")}
                            placeholder={t("enterYourMessage")}
                            required
                            className="min-h-[150px]"
                        />
                    </div>
                </div>
            </div>

            <div className="text-right">
                <Button
                    variant="secondary"
                    icon={FiSend}
                    onClick={handleBroadcast}
                    disabled={!broadcastMessage.trim() || !messageCategory || !messagePriority}
                >
                    {t("broadcast")}
                </Button>
            </div>

            <Modal
                isOpen={isTemplatesModalOpen}
                onClose={() => setIsTemplatesModalOpen(false)}
                title={t('selectTemplate')}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            type="text"
                            placeholder={t('searchTemplates')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Select
                            options={[
                                { value: '', label: t('allCategories') },
                                ...categoryOptions
                            ]}
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            placeholder={t('selectCategory')}
                        />
                        <Select
                            options={[
                                { value: '', label: t('allPriorities') },
                                ...priorityOptions
                            ]}
                            value={selectedPriority}
                            onChange={setSelectedPriority}
                            placeholder={t('selectPriority')}
                        />
                    </div>
                    
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <FiLoader className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin" />
                            </div>
                        ) : filteredTemplates.length > 0 ? (
                            filteredTemplates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => handleTemplateSelect(template)}
                                    className="w-full p-4 text-left bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="font-medium text-gray-800 dark:text-gray-200">
                                            {template.name_pl}
                                        </div>
                                        <Badge variant={getPriorityColor(template.priority)}>
                                            {t(template.priority)}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                        {template.content_pl}
                                    </div>
                                </button>
                            ))
                        ) : (
                            <EmptyState
                                title={t('noTemplatesFound')}
                                description={t('noTemplatesFoundDescription')}
                            />
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default BroadcastPanel;