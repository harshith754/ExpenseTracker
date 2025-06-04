import { useEffect, useState } from "react";
import ExpenseForm from "./ExpenseForm";

export default function Dashboard({ token }: { token: string }) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/expenses/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch expenses");
        return res.json();
      })
      .then(setExpenses)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token, refresh]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this expense?")) return;
    await fetch(`http://localhost:8000/api/expenses/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    });
    setRefresh((r) => r + 1);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8 bg-white rounded-2xl shadow-xl border border-blue-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-700 tracking-tight">
          Dashboard
        </h2>
        <span className="text-gray-500 text-sm">Welcome!</span>
      </div>
      <ExpenseForm token={token} onSuccess={() => setRefresh((r) => r + 1)} />
      {loading ? (
        <div className="text-center py-8 text-blue-500 font-semibold">
          Loading...
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : expenses.length === 0 ? (
        <div className="text-gray-400 text-center py-8">
          No expenses yet. Add your first expense above!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border mt-4 rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-blue-50 text-blue-700">
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr
                  key={exp.id}
                  className="hover:bg-blue-50 transition"
                >
                  <td className="p-2 border text-right font-mono">
                    ₹{exp.amount}
                  </td>
                  <td className="p-2 border">{exp.category}</td>
                  <td className="p-2 border text-gray-600">
                    {exp.description}
                  </td>
                  <td className="p-2 border text-sm">{exp.date}</td>
                  <td className="p-2 border text-center">
                    <button
                      className="text-red-600 hover:underline hover:text-red-800 font-semibold px-2"
                      onClick={() => handleDelete(exp.id)}
                    >
                      Delete
                    </button>
                    {/* Update button can be added here */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
