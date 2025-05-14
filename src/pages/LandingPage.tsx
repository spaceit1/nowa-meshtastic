import React from "react";
import { Link } from "react-router-dom";
import {
    FiUsers,
    FiShield,
    FiRadio,
    FiInfo,
    FiArrowRight,
    FiWifiOff
} from "react-icons/fi";
import { useLanguage } from "../i18n/LanguageContext";
import Menu from "../components/ui/Menu";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Footer from "../components/ui/Footer";

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
            <Menu
                appTitle={t("appTitle")}
                userDashboardText={t("userDashboard")}
                adminDashboardText={t("adminDashboard")}
            />

            <div className="container mx-auto py-6 px-4 max-w-7xl">
                <div className="flex flex-col lg:flex-row mb-10 rounded-xl overflow-hidden shadow-xl bg-white dark:bg-gray-800">
                    <div className="h-[250px] md:h-[300px] lg:h-auto relative flex-1 order-1 lg:order-2">
                        <img
                            src="/main-photo.png"
                            alt={t("heroImageAlt") || "People connected in a communication network"}
                            className="object-cover w-full h-full"
                        />
                    </div>

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
                        badgeTitle={t("activeEmergencyAlert") || "Active Emergency Alert"}
                        date={new Date().toLocaleDateString()}
                        title={t("checkUserAppForDetails") || "Check the user application for latest updates and instructions."}
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

                <div className="mb-10">
                    <h3 className="text-lg font-bold mb-5 text-center text-gray-800 dark:text-gray-100">
                        {t("keyFeatures") || "Key Features"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <Card
                                key={idx}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                variant="feature"
                            />
                        ))}
                    </div>
                </div>

                <Card
                    icon={FiWifiOff}
                    title={t("offlineAccess") || "Offline Access Instructions"}
                    description={t("offlineInstructions") || "This app can work offline when installed. To install:"}
                    steps={[
                        t("offlineStep1") || "Open app in Chrome or Safari",
                        t("offlineStep2") || 'Open browser menu and select "Add to Home Screen"',
                        t("offlineStep3") || "The app will now be available even without internet"
                    ]}
                    variant="instructions"
                />
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;