import React from "react";

interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
    return (
        <div className="p-5 rounded-lg shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
            <Icon className="w-10 h-10 text-blue-700 dark:text-blue-400 mb-4 mx-auto" />
            <h4 className="font-medium text-md mb-2 text-gray-900 dark:text-gray-100">{title}</h4>
            <p className="text-gray-800 dark:text-gray-200">{description}</p>
        </div>
    );
};

export default FeatureCard;