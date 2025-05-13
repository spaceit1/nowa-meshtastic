import React from "react";
import { Link } from "react-router-dom";
import {
    FiUsers,
    FiShield,
    FiRadio,
    FiInfo,
    FiAlertTriangle,
    FiArrowRight
} from "react-icons/fi";
import { useLanguage } from "../../i18n/LanguageContext";
import ThemeToggle from "../../components/ui/ThemeToggle";
import LanguageSelector from "../../components/ui/LanguageSelector";
import FeatureCard from "../../components/ui/FeatureCard";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

interface Feature {
    icon: React.ElementType;
    title: string;
    description: string;
}

const LandingPage: React.FC = () => {
    const { t } = useLanguage();

    const features: Feature[] = [
        {
            icon: FiRadio,
            title: t("meshNetworking") || "Mesh Networking",
            description: t("meshNetworkingDescription") ||
                "Works even when traditional networks are down through decentralized mesh technology.",
        },
        {
            icon: FiInfo,
            title: t("multilingualSupport") || "Multilingual Support",
            description: t("multilingualSupportDescription") ||
                "Automatic translation between Polish, Ukrainian, Russian and English.",
        },
        {
            icon: FiUsers,
            title: t("accessibility") || "Full Accessibility",
            description: t("accessibilityDescription") ||
                "Text-to-speech, voice input, and other accessibility features for all users.",
        },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Header with language and theme switchers */}
            <header className="py-4 px-4 bg-blue-50 dark:bg-blue-900">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <FiRadio className="w-6 h-6 text-blue-500" />
                        <h1 className="text-md md:text-lg font-bold text-blue-500">
                            {t("appTitle")}
                        </h1>
                    </div>

                    {/* Spacer flex to push items to the right */}
                    <div className="flex-1"></div>

                    {/* Navigation links moved more to the right */}
                    <div className="hidden md:flex gap-6 items-center mr-6">
                        <Link
                            to="/user"
                            className="font-medium text-blue-600 hover:text-blue-800 hover:no-underline flex items-center"
                        >
                            <FiUsers className="w-4 h-4 mr-2" />
                            {t("userDashboard")}
                        </Link>

                        <Link
                            to="/admin"
                            className="font-medium text-purple-600 hover:text-purple-800 hover:no-underline flex items-center"
                        >
                            <FiShield className="w-4 h-4 mr-2" />
                            {t("adminDashboard")}
                        </Link>
                    </div>

                    <div className="flex gap-2">
                        <LanguageSelector />
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Main content */}
            <div className="container mx-auto py-6 px-4 max-w-7xl">
                {/* Hero section with image on top for mobile, side-by-side on desktop */}
                <div className="flex flex-col lg:flex-row mb-10 rounded-xl overflow-hidden shadow-xl bg-white dark:bg-gray-800">
                    {/* Image (top on mobile, right on desktop) */}
                    <div className="h-[250px] md:h-[300px] lg:h-auto relative flex-1 order-1 lg:order-2">
                        <img
                            src="/main-photo.png"
                            alt={t("heroImageAlt") || "People connected in a communication network"}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    {/* Text content (below image on mobile, left on desktop) */}
                    <div className="flex flex-col justify-center p-6 md:p-10 flex-1 z-10 order-2 lg:order-1">
                        <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-800 dark:text-white">
                            {t("landingHeroTitle") || "Emergency Mesh Communication"}
                        </h2>
                        <p className="text-md md:text-lg mb-6 text-gray-600 dark:text-gray-300">
                            {t("landingHeroDescription") ||
                                "A reliable, multilingual, and fully accessible communication platform for emergencies, disasters, and critical situations."}
                        </p>

                        <Button
                            to="/user"
                            variant="primary"
                            size="lg"
                            fullWidth
                            icon={FiUsers}
                            iconPosition="left"
                            className="mb-4"
                        >
                            {t("enterUserApp")}
                        </Button>

                        <Link
                            to="/admin"
                            className="flex items-center text-purple-500 font-medium hover:text-purple-600 hover:no-underline"
                        >
                            <FiShield className="w-4 h-4 mr-2" />
                            <span>{t("enterAdminApp")}</span>
                            <FiArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col items-center text-center mb-10 space-y-8">
                    <Alert
                        variant="danger"
                        title={t("activeEmergencyAlert") || "Active Emergency Alert"}
                        date={new Date().toLocaleDateString()}
                        description={t("checkUserAppForDetails") || "Check the user application for latest updates and instructions."}
                    >
                        {t("emergencyInstructions") || "Follow official instructions and keep your device charged. Emergency services are responding."}
                    </Alert>

                    <div className="w-full max-w-md mx-auto my-6">
                        <Button
                            to="/user"
                            variant="primary"
                            size="lg"
                            fullWidth
                            icon={FiUsers}
                            iconPosition="left"
                        >
                            {t("enterUserApp")}
                        </Button>
                    </div>
                </div>

                {/* Key features */}
                <div className="mb-10">
                    <h3 className="text-lg font-bold mb-5 text-center">
                        {t("keyFeatures") || "Key Features"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <FeatureCard
                                key={idx}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                            />
                        ))}
                    </div>
                </div>

                {/* Offline instructions */}
                <div className="p-5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-6">
                    <h3 className="font-bold text-md mb-3">
                        {t("offlineAccess") || "Offline Access Instructions"}
                    </h3>
                    <p className="mb-3">
                        {t("offlineInstructions") || "This app can work offline when installed. To install:"}
                    </p>
                    <div className="flex flex-col items-start space-y-2">
                        <p>• {t("offlineStep1") || "Open app in Chrome or Safari"}</p>
                        <p>• {t("offlineStep2") || 'Open browser menu and select "Add to Home Screen"'}</p>
                        <p>• {t("offlineStep3") || "The app will now be available even without internet"}</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-4 px-4 bg-blue-50 dark:bg-blue-900 text-center">
                <p className="text-sm">
                    {t("footerText") || "© 2025 Emergency Mesh Communication System"}
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;