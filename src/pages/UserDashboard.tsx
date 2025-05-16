import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FiUsers,
    FiShield,
    FiRadio,
    FiInfo,
    FiArrowRight,
    FiWifiOff,
    FiMessageSquare,
    FiMic,
    FiVolume2,
    FiSend,
    FiFileText,
    FiChevronDown,
    FiChevronUp
} from "react-icons/fi";
import { useLanguage } from "../i18n/LanguageContext";
import Menu from "../components/ui/Menu";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Footer from "../components/ui/Footer";
import Badge from "../components/ui/Badge";
import type { BadgeVariant } from "../components/ui/Badge";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

interface Message {
    id: string;
    content: string;
    timestamp: string;
    isFromAdmin: boolean;
    status: 'read' | 'unread';
}

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
}

const UserDashboard: React.FC = () => {
    const { t } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    useEffect(() => {
        // Inicjalizacja Web Speech API
        if ('webkitSpeechRecognition' in window) {
            const recognition = new (window as any).webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'pl-PL';

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setNewMessage(transcript);
                setIsRecording(false);
            };

            recognition.onerror = (event: any) => {
                console.error('Błąd rozpoznawania mowy:', event.error);
                setIsRecording(false);
            };

            setRecognition(recognition);
        }

        // Symulacja pobrania wiadomości
        setMessages([
            {
                id: '1',
                content: 'Witaj w systemie! Jak możemy Ci pomóc?',
                timestamp: new Date().toISOString(),
                isFromAdmin: true,
                status: 'unread'
            }
        ]);

        // Pobieranie szablonów i kategorii
        fetchTemplates();
        fetchCategories();
    }, []);

    const fetchTemplates = async () => {
        try {
            const { data, error } = await supabase
                .from('user_message_templates')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTemplates(data || []);
        } catch (error) {
            toast.error(t('errorFetchingTemplates'));
            console.error('Error fetching templates:', error);
        }
    };

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

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    };

    const handleTemplateSelect = (template: Template) => {
        setNewMessage(template.content_pl);
        toast.success(t('templateLoaded'));
    };

    const startRecording = () => {
        if (recognition) {
            setIsRecording(true);
            recognition.start();
        }
    };

    const stopRecording = () => {
        if (recognition) {
            recognition.stop();
            setIsRecording(false);
        }
    };

    const speakMessage = (message: string) => {
        if ('speechSynthesis' in window) {
            setIsSpeaking(true);
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = 'pl-PL';
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message: Message = {
                id: Date.now().toString(),
                content: newMessage,
                timestamp: new Date().toISOString(),
                isFromAdmin: false,
                status: 'unread'
            };
            setMessages(prev => [...prev, message]);
            setNewMessage("");
        }
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

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Menu
                appTitle={t("appTitle")}
                userDashboardText={t("userDashboard")}
                adminDashboardText={t("adminDashboard")}
            />

            <div className="container mx-auto py-6 px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Panel główny */}
                    <div className="lg:col-span-2">
                        <Card variant="default" className="bg-white dark:bg-gray-800">
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                                    {t("messages")}
                                </h2>
                                <div className="space-y-4">
                                    {messages
                                        .filter(message => message.content.trim() !== '')
                                        .map((message) => (
                                        <div
                                            key={message.id}
                                            className={`p-4 rounded-lg ${
                                                message.isFromAdmin
                                                    ? "bg-blue-50 dark:bg-blue-900/20"
                                                    : "bg-gray-50 dark:bg-gray-700/50"
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge
                                                    variant={message.isFromAdmin ? "blue" : "green"}
                                                >
                                                    {message.isFromAdmin ? t("admin") : t("you")}
                                                </Badge>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(message.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300 mb-2">
                                                {message.content}
                                            </p>
                                            {message.isFromAdmin && (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => speakMessage(message.content)}
                                                    disabled={isSpeaking}
                                                >
                                                    <FiVolume2 className="mr-2" />
                                                    {isSpeaking ? t("speaking") : t("readAloud")}
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Panel boczny */}
                    <div className="lg:col-span-1">
                        <Card variant="default" className="bg-white dark:bg-gray-800">
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                                    {t("sendMessage")}
                                </h3>
                                <div className="space-y-4">
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t("messageTemplates")}
                                        </h4>
                                        <div className="space-y-2">
                                            {categories
                                                .filter(category => 
                                                    templates.some(template => template.category_id === category.id)
                                                )
                                                .map((category) => (
                                                <div key={category.id} className="border rounded-lg overflow-hidden">
                                                    <button
                                                        className="w-full p-2 flex items-center justify-between bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                        onClick={() => toggleCategory(category.id)}
                                                    >
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                                            {category.name_pl}
                                                        </span>
                                                        {expandedCategories.has(category.id) ? (
                                                            <FiChevronUp className="text-gray-500" />
                                                        ) : (
                                                            <FiChevronDown className="text-gray-500" />
                                                        )}
                                                    </button>
                                                    {expandedCategories.has(category.id) && (
                                                        <div className="p-2 space-y-2 bg-white dark:bg-gray-800">
                                                            {templates
                                                                .filter(template => template.category_id === category.id)
                                                                .map(template => (
                                                                    <button
                                                                        key={template.id}
                                                                        className="w-full p-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center justify-between"
                                                                        onClick={() => handleTemplateSelect(template)}
                                                                    >
                                                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                            {template.name_pl}
                                                                        </span>
                                                                        <Badge variant={getPriorityColor(template.priority)}>
                                                                            {template.priority === 'critical' ? t('critical') :
                                                                             template.priority === 'high' ? t('high') :
                                                                             template.priority === 'medium' ? t('medium') :
                                                                             template.priority === 'low' ? t('low') : ''}
                                                                        </Badge>
                                                                    </button>
                                                                ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <textarea
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        rows={4}
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder={t("typeMessage")}
                                    />
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={isRecording ? stopRecording : startRecording}
                                        >
                                            <FiMic className={`mr-2 ${isRecording ? "text-red-500" : ""}`} />
                                            {isRecording ? t("stopRecording") : t("startRecording")}
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim()}
                                        >
                                            <FiSend className="mr-2" />
                                            {t("send")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default UserDashboard;