import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Catalogue from "./pages/Catalogue";
import CatalogueDetails from "./pages/CatalogueDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./admin/components/ProtectedRoute";

import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import PortfolioManagement from "./admin/pages/PortfolioManagement";
import CataloguesManagement from "./admin/pages/CataloguesManagement";
import AdminPlaceholder from "./admin/pages/AdminPlaceholder";
import PortfolioForm from "./admin/pages/PortfolioForm";
import CatalogueForm from "./admin/pages/CatalogueForm";
import AgreementsManagement from "./admin/pages/AgreementsManagement";

function PublicLayout() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/catalogue/:slug" element={<CatalogueDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website */}
        <Route path="/*" element={<PublicLayout />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />

            <Route path="portfolio" element={<PortfolioManagement />} />

            <Route path="portfolio/new" element={<PortfolioForm />} />

            <Route path="portfolio/:id/edit" element={<PortfolioForm />} />

            <Route path="catalogue" element={<CataloguesManagement />} />
            <Route path="catalogue/new" element={<CatalogueForm />} />

            <Route path="catalogue/:id/edit" element={<CatalogueForm />} />

            <Route path="agreements" element={<AgreementsManagement />} />

            <Route path="customers" element={<AdminPlaceholder />} />

            <Route path="settings" element={<AdminPlaceholder />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
