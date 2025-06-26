import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../components/ui/Spinner";

const RegisterPage = () => {
  const { register, isAuthenticated, error, loading } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    role: "student",
  });

  const [formError, setFormError] = useState("");

  const { name, email, password, password2, role } = user;

  useEffect(() => {
    rd;
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setFormError("");
    if (password !== password2) {
      setFormError("Passwords do not match");
    } else {
      register({ name, email, password, role });
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg">
        <form
          onSubmit={onSubmit}
          className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
        >
          <h1 className="text-2xl font-bold text-center mb-6">
            Create Your Account
          </h1>

          {error && (
            <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
              {error}
            </p>
          )}

          {formError && (
            <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
              {formError}
            </p>
          )}

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              minLength="6"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="password2"
              value={password2}
              onChange={onChange}
              required
              minLength="6"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="role"
            >
              I am a...
            </label>
            <select
              name="role"
              value={role}
              onChange={onChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 bg-white"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300"
            >
              {loading ? <Spinner /> : "Register"}
            </button>
          </div>
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-blue-500 hover:text-blue-800"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
