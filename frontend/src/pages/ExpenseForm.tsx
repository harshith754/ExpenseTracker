export type Expense = {
  id: number;
  amount: number;
  category: string;
  description: string;
  date: string;
};

import { useState } from "react";

export default function ExpenseForm({
  token,
  onSuccess,
}: {
  token: string;
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          category,
          description,
          date,
        }),
      });
      if (!res.ok) throw new Error("Failed to add expense");
      onSuccess();
      setAmount("");
      setCategory("");
      setDescription("");
      setDate("");
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow mb-4 flex flex-col gap-2"
    >
      <div className="flex gap-2">
        <input
          className="border px-2 py-1 rounded w-24"
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          className="border px-2 py-1 rounded w-32"
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          className="border px-2 py-1 rounded flex-1"
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="border px-2 py-1 rounded w-36"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 w-fit self-end disabled:opacity-50"
        type="submit"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
}
