import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../components/ui/Spinner";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

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
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Submit button clicked, onSubmit function started.");
    
    setFormError("");
    if (password !== password2) {
      console.log("Validation FAILED: Passwords do not match.");
      setFormError("Passwords do not match");
    } else {
      console.log("Validation PASSED. Calling register() with:", { name, email, role });
      register({ name, email, password, role });
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg">
        <form
          onSubmit={onSubmit}
          className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4"
        >
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Create Your Account
          </h1>

          {error && (
            <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
              {error}
            </p>
          )}

          <div className="space-y-4">
            <Input
              id="name"
              label="Full Name"
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
            />
            <Input
              id="email"
              label="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              minLength="6"
            />
            <Input
              id="password2"
              label="Confirm Password"
              type="password"
              name="password2"
              value={password2}
              onChange={onChange}
              required
              minLength="6"
              error={formError}
            />
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="role"
              >
                I am a...
              </label>
              <select
                name="role"
                id="role"
                value={role}
                onChange={onChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Spinner /> : "Register"}
            </Button>
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