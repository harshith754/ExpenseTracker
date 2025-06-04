import { useState } from "react";

export default function ExpenseForm({
  token,
  onSuccess,
}: {
  token: string;
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = ["Food", "Travel", "Utilities", "Misc"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !title || !category || !date) {
      setError("Please fill in all required fields");
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/expenses/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          title: title.trim(),
          category: category.charAt(0).toLowerCase() + category.slice(1),
          notes: notes.trim(),
          date,
        }),
      });

      if (!res.ok) throw new Error("Failed to add expense");

      onSuccess();

      // Reset form
      setAmount("");
      setTitle("");
      setCategory("");
      setNotes("");
      setDate(new Date().toISOString().split("T")[0]);

      // Show success message briefly
      const successMsg = document.createElement("div");
      successMsg.className =
        "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300";
      successMsg.textContent = "Expense added successfully!";
      document.body.appendChild(successMsg);

      setTimeout(() => {
        successMsg.style.transform = "translateX(400px)";
        setTimeout(() => document.body.removeChild(successMsg), 300);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error adding expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white text-xl font-bold">+</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Add New Expense</h3>
          <p className="text-gray-600">Track your spending</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <span className="flex items-center">
                <span className="mr-2">🏷️</span>
                Title *
              </span>
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 text-base text-gray-800"
              type="text"
              placeholder="Expense title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={50}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <span className="flex items-center">
                <span className="mr-2">💰</span>
                Amount *
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                ₹
              </span>
              <input
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 text-base font-medium text-gray-800"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <span className="flex items-center">
              <span className="mr-2">🏷️</span>
              Category *
            </span>
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 text-base bg-white text-gray-800"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <span className="flex items-center">
              <span className="mr-2">📝</span>
              Notes
            </span>
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 text-base resize-none text-gray-800"
            rows={2}
            placeholder="What did you spend on? (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={200}
          />
          <div className="text-right text-sm text-gray-400 mt-1">
            {notes.length}/200
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <span className="flex items-center">
              <span className="mr-2">📅</span>
              Date *
            </span>
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 text-base text-gray-800"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-5 py-4 rounded-r-xl">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠</span>
              {error}
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold text-base hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <span>Add Expense</span>
                <span>💸</span>
              </span>
            )}
          </button>

          <button
            className="px-4 py-3 border-2 border-gray-200 text-white rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 text-base"
            onClick={() => {
              setAmount("");
              setTitle("");
              setCategory("");
              setNotes("");
              setDate(new Date().toISOString().split("T")[0]);
              setError("");
            }}
            disabled={loading}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
