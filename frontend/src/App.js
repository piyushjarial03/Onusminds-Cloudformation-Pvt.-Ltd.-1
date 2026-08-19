import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { SiteProvider } from "./context/SiteContext";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import Home from "./pages/Home";
import CompanyPage from "./pages/Company";
import ServiceDetail from "./pages/ServiceDetail";
import Careers from "./pages/Careers";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

const ScrollManager = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.08 });
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <AuthProvider>
      <SiteProvider>
      <BrowserRouter>
        <ScrollManager />
        <div className="min-h-screen bg-[#050505] text-white font-body">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/company/:slug" element={<CompanyPage />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<NewsArticle />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Home />} />
          </Routes>
          <Footer />
          <FloatingWhatsApp />
          <Toaster theme="dark" position="bottom-left" />
        </div>
      </BrowserRouter>
      </SiteProvider>
    </AuthProvider>
  );
}

export default App;
