"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function NewRecipePage() {
  const { isSignedIn } = useUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isSignedIn) {
    return <div className="p-10 text-red-500">Please sign in first</div>;
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          ingredients: ingredients
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean),
        }),
      });

      console.log("STATUS:", res.status);

      const data = await res.json();
      console.log("RESPONSE:", data);

      if (res.ok) {
        alert(" Recipe created");

        // reset form
        setTitle("");
        setDescription("");
        setIngredients("");
      } else {
        alert(data.error || " Error creating recipe");
      }
    } catch (err) {
      console.error("FETCH ERROR:", err);
      alert(" Network error or API blocked (check middleware)");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Recipe</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-2"
          placeholder="Recipe Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="border p-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          className="border p-2"
          placeholder="Ingredients (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Recipe"}
        </button>
      </form>
    </div>
  );
}