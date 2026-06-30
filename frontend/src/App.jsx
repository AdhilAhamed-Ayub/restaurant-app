import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LandingPage from './LandingPage';
import MenuPage from './MenuPage';
import AdminMenuAdd from './AdminMenuAdd';
import StaffDashboard from './StaffDashboard';
import OrderDetails from './OrderDetails';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import AdminDashboard from './AdminDashboard';
import AdminLayout from './AdminLayout';
import { useAuth } from './AuthContext';

function App() {
  const { isAuthenticated, user } = useAuth();

  // Protected Route component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/menu" element={<MenuPage />} />

        {/* Staff Routes */}
        <Route 
          path="/staff-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_STAFF', 'ROLE_ADMIN']}>
              <StaffDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/order-details/:id" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_STAFF', 'ROLE_ADMIN']}>
              <OrderDetails />
            </ProtectedRoute>
          } 
        />

        {/* Nested Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="menu/add" element={<AdminMenuAdd />} />
        </Route>

        {/* Legacy redirect for old paths */}
        <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin-menu-add" element={<Navigate to="/admin/menu/add" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
