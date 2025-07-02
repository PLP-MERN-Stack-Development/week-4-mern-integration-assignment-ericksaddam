import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow mb-6">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          MERN PLP Blog
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/posts" className="text-gray-700 hover:text-blue-600">Posts</Link>
          {user ? (
            <>
              <Link to="/posts/create" className="text-gray-700 hover:text-blue-600">New Post</Link>
              <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
              <button onClick={logout} className="text-red-500 hover:underline">Logout</button>
              {user.role === 'admin' && (
                <Link to="/admin/users" className="text-gray-700 hover:text-blue-600">Users</Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
              <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
