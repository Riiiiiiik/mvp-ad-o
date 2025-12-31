import { useEffect, useState } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import PropertyManagement from './pages/PropertyManagement';
import LoginPage from './pages/LoginPage';
import SobrePage from './pages/SobrePage';
import BlogPage from './pages/BlogPage';
import LegalPage from './pages/LegalPage';
import CookieBanner from './components/CookieBanner';
import AnalyticsPage from './pages/AnalyticsPage';
import SiteCMS from './pages/SiteCMS';
import UserManagement from './pages/UserManagement';
import SecurityLogs from './pages/SecurityLogs';

function App() {
  const [path, setPath] = useState(window.location.hash || '#/');

  useEffect(() => {
    // If user typed /admin, rewrite to /#/admin and clear path
    if (window.location.pathname === '/admin') {
      window.location.href = '/#/admin';
      return;
    }

    const handleHashChange = () => setPath(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);



  const renderPage = () => {
    switch (path) {
      case '#/admin':
        return <Dashboard />;
      case '#/admin/properties':
        return <PropertyManagement />;
      case '#/admin/analytics':
        return <AnalyticsPage />;
      case '#/admin/cms':
        return <SiteCMS />;
      case '#/admin/users':
        return <UserManagement />;
      case '#/admin/audit':
        return <SecurityLogs />;
      case '#/login':
        return <LoginPage />;
      case '#/sobre':
        return <SobrePage />;
      case '#/blog':
        return <BlogPage />;
      case '#/privacidade':
      case '#/termos':
      case '#/responsabilidade':
        return <LegalPage />;
      case '#/':
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="w-full min-h-screen">
      {renderPage()}
      <CookieBanner />
    </div>
  );
}

export default App;
