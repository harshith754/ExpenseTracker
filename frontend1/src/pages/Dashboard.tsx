import { useEffect, useState } from "react";
import ExpenseForm from "./ExpenseForm";

export default function Dashboard({
  token,
  onLogout,
}: {
  token: string;
  onLogout: () => void;
}) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [editExpense, setEditExpense] = useState<any | null>(null);

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

  const handleUpdate = (expense: any) => {
    setEditExpense(expense);
    // Optionally, scroll to form or highlight
  };

  return (
    <div className="max-w-fit mx-auto p-4 mt-6 bg-white rounded-xl shadow-lg border border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-blue-700 tracking-tight">
          Dashboard
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-xs">Welcome!</span>
          <button
            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 border border-red-200 text-xs font-semibold transition"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <ExpenseForm
            token={token}
            onSuccess={() => setRefresh((r) => r + 1)}
          />
        </div>
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-6 text-blue-500 font-semibold text-base">
              Loading...
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-3 text-base">
              {error}
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-gray-400 text-center py-6 text-base">
              No expenses yet. Add your first expense above!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border mt-3 rounded-lg overflow-hidden shadow-sm text-sm bg-white">
                <thead>
                  <tr className="bg-blue-100 text-blue-800 font-semibold">
                    <th className="p-3 border text-left">Amount</th>
                    <th className="p-3 border text-left">Category</th>
                    <th className="p-3 border text-left">Notes</th>
                    <th className="p-3 border text-left">Date</th>
                    <th className="p-3 border text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp) => (
                    <tr
                      key={exp.id}
                      className="hover:bg-blue-50 transition border-b last:border-b-0"
                    >
                      <td className="p-3 border text-right font-mono text-blue-900 bg-blue-50/40">
                        ₹{exp.amount}
                      </td>
                      <td className="p-3 border text-blue-700 bg-blue-50/20">
                        {exp.category.charAt(0).toUpperCase() +
                          exp.category.slice(1)}
                      </td>
                      <td className="p-3 border text-gray-700 bg-white">
                        {exp.notes}
                      </td>
                      <td className="p-3 border text-xs text-gray-500 bg-white">
                        {exp.date}
                      </td>
                      <td className="p-3 border text-center bg-white flex flex-col gap-2 items-center justify-center border-grey-200">
                        <button
                          className="text-red-600 hover:underline hover:text-red-800 font-semibold px-2 text-xs rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-300 border border-red-200 bg-red-50/40"
                          onClick={() => handleDelete(exp.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="text-indigo-600 hover:underline hover:text-indigo-800 font-semibold px-2 text-xs rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-300 border border-indigo-200 bg-indigo-50/40"
                          onClick={() => handleUpdate(exp)}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
