import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import InfrastructuresPage from './pages/InfrastructuresPage';
import PartnersPage from './pages/PartnersPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import ContactPage from './pages/ContactPage';
import JobDetailPage from './pages/JobDetailPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminActualites from './pages/admin/AdminActualites';
import AdminMessages from './pages/admin/AdminMessages';
import AdminNewsletter from './pages/admin/AdminNewsletter';
import AdminVisitRequests from './pages/admin/AdminVisitRequests';
import AdminQuotes from './pages/admin/AdminQuotes';
import AdminInfrastructures from './pages/admin/AdminInfrastructures';
import AdminPartenaires from './pages/admin/AdminPartenaires';
import AdminCandidatures from './pages/admin/AdminCandidatures';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminRegister from './pages/admin/AdminRegister';
import AdminForgotPassword from './pages/admin/AdminForgotPassword';
import AdminVerifyCode from './pages/admin/AdminVerifyCode';
import AdminResetPassword from './pages/admin/AdminResetPassword';
import ProtectedRoute from './components/admin/ProtectedRoute';
import LoadingPage from './components/LoadingPage';
import { usePageTracker } from './hooks/usePageTracker';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasSeenLoading = sessionStorage.getItem('hasSeenLoading');
    if (hasSeenLoading) {
      setIsLoading(false);
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem('hasSeenLoading', 'true');
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingPage onLoadingComplete={handleLoadingComplete} duration={2000} />;
  }

  return (
    <BrowserRouter>
      <PageTracker />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register/:token" element={<AdminRegister />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/verify-code/:token" element={<AdminVerifyCode />} />
        <Route path="/admin/reset-password/:token" element={<AdminResetPassword />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="partners" element={<AdminPartenaires />} />
          <Route path="infrastructures" element={<AdminInfrastructures />} />
          <Route path="actualites" element={<AdminActualites />} />
          <Route path="candidatures" element={<AdminCandidatures />} />
          <Route path="quotes" element={<AdminQuotes />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
          <Route path="visit-requests" element={<AdminVisitRequests />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route
          path="*"
          element={
            <div className="min-h-screen bg-white">
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/infrastructures" element={<InfrastructuresPage />} />
                <Route path="/partners" element={<PartnersPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:id" element={<NewsDetailPage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
              <Footer />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function PageTracker() {
  usePageTracker();
  return null;
}

export default App;
