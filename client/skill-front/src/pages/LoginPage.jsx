import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../components/ui/Spinner";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isAuthenticated, loading, error } = useAuth();
  const navigate = useNavigate();
  const { email, password } = formData;

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4"
        >
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Welcome Back!
          </h1>

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="mb-4">
            <Input
              id="email"
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <Input
              id="password"
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Spinner /> : "Sign In"}
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-blue-500 hover:text-blue-800 transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;