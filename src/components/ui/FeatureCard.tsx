import React from "react";

interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
    return (
        <div className="p-5 rounded-lg shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
            <Icon className="w-10 h-10 text-blue-500 mb-4 mx-auto" />
            <h4 className="font-medium text-md mb-2">{title}</h4>
            <p>{description}</p>
        </div>
    );
};

export default FeatureCard;