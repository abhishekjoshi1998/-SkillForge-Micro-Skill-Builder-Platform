import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">SkillForge</Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {user?.role === 'instructor' && (
                <Link to="/create-course" className="text-gray-800 hover:text-blue-500">Create Course</Link>
              )}
              <Link to="/dashboard" className="text-gray-800 hover:text-blue-500">Dashboard</Link>
              <button onClick={handleLogout} className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-800 hover:text-blue-500">Login</Link>
              <Link to="/register" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;