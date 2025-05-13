import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext";
import { useDocumentLanguage } from "./hooks/useDocumentLanguage";
import LandingPage from "./pages/landing/LandingPage";

// Zaślepki dla nieistniejących jeszcze komponentów
const UserDashboard = () => <div className="p-4">User Dashboard</div>;
const AdminDashboard = () => <div className="p-4">Admin Dashboard</div>;

const AppContent: React.FC = () => {
  useDocumentLanguage();
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;