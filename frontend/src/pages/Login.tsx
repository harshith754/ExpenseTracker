import { useState } from "react";

export default function LoginPage({
  onLogin,
  onGoToRegister,
}: {
  onLogin: (token: string) => void;
  onGoToRegister: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/get-token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();
      if (data.token) {
        onLogin(data.token);
      } else {
        setError("No token returned");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-auto flex items-center justify-center bg-gradient-to-br from-indigo-50 bg-red-500 via-white to-cyan-50">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-100 opacity-50"></div>

      <div className="relative bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/30">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <span className="text-white text-2xl font-bold">₹</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Expense Tracker
          </h1>
          <p className="text-gray-600 text-lg">Track your expenses with ease</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Username
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 bg-gray-50 focus:bg-white text-base text-gray-800"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>

            <div>
              <label className="text-red-300 block text-sm font-semibold text-gray-700 mb-3">
                Password
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 bg-gray-50 focus:bg-white text-base text-gray-800"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-5 py-4 rounded-r-xl">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠</span>
                {error}
              </div>
            </div>
          )}

          <button
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Demo credentials: admin / password
          </p>
          <button
            className="mt-4 text-indigo-600 hover:underline text-sm"
            onClick={onGoToRegister}
          >
            Don't have an account? Register
          </button>
        </div>
      </div>
    </div>
  );
}
