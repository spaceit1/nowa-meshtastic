import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext";
import { useDocumentLanguage } from "./hooks/useDocumentLanguage";
import { useAuth } from "./hooks/useAuth";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import { LoginForm } from "./components/LoginForm";
import UserDashboard from "./pages/UserDashboard";
// Importuj DeviceWrapper i potrzebne zależności
import { DeviceWrapper } from "./DeviceWrapper"; // Dostosuj ścieżkę
import { useDeviceStore } from "@core/stores/deviceStore"; // Dostosuj ścieżkę

// Komponent chroniący ścieżkę admina
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
  // Dodaj hook useDeviceStore, żeby uzyskać device
  const { getDevice } = useDeviceStore();
  const selectedDevice = null; // Tutaj możesz ustawić ID wybranego urządzenia, jeśli takie masz
  const device = selectedDevice ? getDevice(selectedDevice) : undefined;

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