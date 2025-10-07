import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DataModeProvider } from './contexts/DataModeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import CategoryResults from './pages/CategoryResults';
import ListingDetail from './pages/ListingDetail';
import SellerProfile from './pages/SellerProfile';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';

function App() {
  const { i18n } = useTranslation();

  return (
    <DataModeProvider>
      <div className={i18n.language === 'am' ? 'font-ethiopic' : ''}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="category/:category" element={<CategoryResults />} />
            <Route path="listing/:id" element={<ListingDetail />} />
            <Route path="seller/:id" element={<SellerProfile />} />
            <Route path="dashboard" element={<SellerDashboard />} />
            <Route path="dashboard/create" element={<CreateListing />} />
            <Route path="dashboard/edit/:id" element={<EditListing />} />
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </div>
    </DataModeProvider>
  );
}

export default App;

