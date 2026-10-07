import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import { BookmarkProvider } from './context/BookmarkContext.jsx';
import { FilterProvider } from './context/FilterContext.jsx';

// Layout components
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';

// Pages imports
import Home from './pages/Home/Home.jsx';
import BrowseSchemes from './pages/BrowseSchemes/BrowseSchemes.jsx';
import SchemeDetails from './pages/SchemeDetails/SchemeDetails.jsx';
import VerifyEligibility from './pages/Eligibility/VerifyEligibility.jsx';
import EligibilityResult from './pages/Eligibility/EligibilityResult.jsx';
import FindSchemes from './pages/FindSchemes/FindSchemes.jsx';
import Login from './pages/Login/Login.jsx';
import Signup from './pages/Signup/Signup.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Profile from './pages/Profile/Profile.jsx';
import Bookmarks from './pages/Bookmarks/Bookmarks.jsx';
import AdminLogin from './pages/Admin/AdminLogin.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import ManageSchemes from './pages/Admin/ManageSchemes.jsx';
import SchemeEditor from './pages/Admin/SchemeEditor.jsx';
import CategoriesView from './pages/Admin/CategoriesView.jsx';
import UsersView from './pages/Admin/UsersView.jsx';
import AdminSettings from './pages/Admin/AdminSettings.jsx';
import NotFound from './pages/Error/NotFound.jsx';

// Protected Route Guard for general users
const ProtectedRoute = ({ children }) => {
  const { token, loading, isAdmin } = useContext(AuthContext);
  
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', margin: '4rem' }}>Loading session...</div>;
  if (!token) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
  
  return children;
};

// Admin Route Guard
const AdminRoute = ({ children }) => {
  const { token, loading, isAdmin } = useContext(AuthContext);
  
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', margin: '4rem' }}>Loading session...</div>;
  if (!token || !isAdmin) return <Navigate to="/admin/login" replace />;
  
  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<BrowseSchemes />} />
            <Route path="/scheme/:slug" element={<SchemeDetails />} />
            <Route path="/find-schemes" element={<FindSchemes />} />
            <Route path="/eligibility/:slug" element={<VerifyEligibility />} />
            <Route path="/eligibility-result" element={<EligibilityResult />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* User Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/bookmarks" element={
              <ProtectedRoute>
                <Bookmarks />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/manage-schemes" element={
              <AdminRoute>
                <ManageSchemes />
              </AdminRoute>
            } />
            <Route path="/admin/add-scheme" element={
              <AdminRoute>
                <SchemeEditor />
              </AdminRoute>
            } />
            <Route path="/admin/edit-scheme/:id" element={
              <AdminRoute>
                <SchemeEditor />
              </AdminRoute>
            } />
            <Route path="/admin/categories" element={
              <AdminRoute>
                <CategoriesView />
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <UsersView />
              </AdminRoute>
            } />
            <Route path="/admin/settings" element={
              <AdminRoute>
                <AdminSettings />
              </AdminRoute>
            } />
            
            {/* Fallback 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <BookmarkProvider>
        <FilterProvider>
          <AppRoutes />
        </FilterProvider>
      </BookmarkProvider>
    </AuthProvider>
  );
}

export default App;
