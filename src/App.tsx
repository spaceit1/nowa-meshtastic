import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext";
import { useDocumentLanguage } from "./hooks/useDocumentLanguage";
import { useAuth } from "./hooks/useAuth";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import { LoginForm } from "./components/LoginForm";
import UserDashboard from "./pages/UserDashboard";
import { DeviceWrapper } from "./DeviceWrapper";
import { useDeviceStore } from "@core/stores/deviceStore";

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-4">Ładowanie...</div>;
  }

  if (!user) {
    return <LoginForm />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  useDocumentLanguage();
  const { getDevices } = useDeviceStore();
  const devices = getDevices();
  const device = devices.length > 0 ? devices[0] : undefined;

  return (
    <DeviceWrapper device={device}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </DeviceWrapper>
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