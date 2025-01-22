import { useState } from "react";
import { loginUser } from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../slices/globalSlice";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const loading = useSelector((state) => state.global.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    setError("");

    try {
      const response = await loginUser(formData);
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("userId", response.data.id);
      dispatch(setUser(response.data.user));
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Login</h2>
        <div className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 py-2 rounded-lg text-white font-medium ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        <p className="mt-4 text-gray-600 text-sm">
          Don&apos;t have an account?&nbsp;
          <span
            onClick={() => navigate("/register")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
