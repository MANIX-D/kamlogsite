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
import ContactPage from './pages/ContactPage';
import JobDetailPage from './pages/JobDetailPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminActualites from './pages/admin/AdminActualites';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminJobOffers from './pages/admin/AdminJobOffers';
import AdminMessages from './pages/admin/AdminMessages';
import AdminNewsletter from './pages/admin/AdminNewsletter';
import AdminVisitRequests from './pages/admin/AdminVisitRequests';
import AdminQuotes from './pages/admin/AdminQuotes';
import ProtectedRoute from './components/admin/ProtectedRoute';
import LoadingPage from './components/LoadingPage';

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
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="actualites" element={<AdminActualites />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="job-offers" element={<AdminJobOffers />} />
          <Route path="quotes" element={<AdminQuotes />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
          <Route path="visit-requests" element={<AdminVisitRequests />} />
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

export default App;
