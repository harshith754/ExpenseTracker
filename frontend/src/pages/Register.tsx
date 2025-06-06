import { useState } from "react";

export default function RegisterPage({ onRegister, onGoToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setSuccess("Registration successful! You can now log in.");
      setUsername("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="relative bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/30">
        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 text-base text-gray-800"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 text-base text-gray-800"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-600 text-center">{error}</div>}
          {success && (
            <div className="text-green-600 text-center">{success}</div>
          )}
          <button
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold text-base hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            className="text-indigo-600 hover:underline"
            onClick={onGoToLogin}
          >
            Already have an account? Log in
          </button>
        </div>
      </div>
    </div>
  );
}
