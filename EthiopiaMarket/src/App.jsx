import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './contexts/AuthContext';
import { DataModeProvider } from './contexts/DataModeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import CategoryResults from './pages/CategoryResults';
import ListingDetail from './pages/ListingDetail';
import SellerProfile from './pages/SellerProfile';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const { i18n } = useTranslation();

  return (
    <AuthProvider>
      <DataModeProvider>
        <div className={i18n.language === 'am' ? 'font-ethiopic' : ''}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Routes with layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="category/:category" element={<CategoryResults />} />
              <Route path="listing/:id" element={<ListingDetail />} />
              <Route path="seller/:id" element={<SellerProfile />} />
              
              {/* Protected routes */}
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <SellerDashboard />
                </ProtectedRoute>
              } />
              <Route path="dashboard/create" element={
                <ProtectedRoute>
                  <CreateListing />
                </ProtectedRoute>
              } />
              <Route path="dashboard/edit/:id" element={
                <ProtectedRoute>
                  <EditListing />
                </ProtectedRoute>
              } />
              <Route path="admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </div>
      </DataModeProvider>
    </AuthProvider>
  );
}

export default App;

