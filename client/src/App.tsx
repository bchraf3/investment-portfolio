import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { HomePage } from './pages/home-page';
import { DashboardPage } from './pages/dashboard-page';
import { ProfilePage } from './pages/profile-page';
import { CallbackPage } from './pages/callback-page';
import { NotFoundPage } from './pages/not-found-page';
import { AuthGuard } from './auth/auth-guard';
import { Navbar } from './components/layout/nav-bar';
import { LoadingSpinner } from './components/common/loading-spinner';
<<<<<<< HEAD
import { AccountSettingsPage } from './pages/account-settings-page';
=======
import { useUserSync } from './hooks/useUserSync';
>>>>>>> f1585942e56ce46fba7cd82e054aa8bac25f70ea

function App() {
  const { isLoading } = useAuth0();
  useUserSync();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/callback" element={<CallbackPage />} />
          <Route path="/dashboard" element={<AuthGuard component={DashboardPage} />} />
          <Route path="/profile" element={<AuthGuard component={ProfilePage} />} />
          <Route path="/settings" element={<AuthGuard component={AccountSettingsPage} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;