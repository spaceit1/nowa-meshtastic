import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext";
import LandingPage from "./pages/landing/LandingPage";

// Zaślepki dla nieistniejących jeszcze komponentów
const UserDashboard = () => <div className="p-4">User Dashboard</div>;
const AdminDashboard = () => <div className="p-4">Admin Dashboard</div>;

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
};

export default App;