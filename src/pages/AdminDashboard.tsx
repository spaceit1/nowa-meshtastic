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

const AdminDashboard: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Menu
                appTitle={t("appTitle")}
                userDashboardText={t("userDashboard")}
                adminDashboardText={t("adminDashboard")}
            />

            <div className="container mx-auto py-6 px-4 max-w-7xl">
                <h1>Admin Dashboard</h1>
            </div>

            <Footer />
        </div>
    );
};

export default AdminDashboard;