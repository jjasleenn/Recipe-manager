"use client";

import { useEffect, useState } from "react";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);

  async function loadRecipes() {
    const res = await fetch("/api/recipes", { cache: "no-store" });
    const data = await res.json();
    setRecipes(data);
  }

  async function deleteRecipe(id: number) {
    if (!confirm("Delete this recipe?")) return;

    const res = await fetch(`/api/recipes/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Recipe deleted");
      loadRecipes();
    } else {
      alert("Error deleting recipe");
    }
  }

  useEffect(() => {
    loadRecipes();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Recipes</h1>

      {recipes.length === 0 && <p>No recipes yet.</p>}

      <ul className="space-y-4">
        {recipes.map((recipe: any) => (
          <li
            key={recipe.id}
            className="border p-4 rounded-md flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{recipe.title}</h2>
              <p className="text-zinc-600">{recipe.description}</p>
            </div>

            <button
              onClick={() => deleteRecipe(recipe.id)}
              className="px-3 py-1 bg-red-600 text-white rounded-md"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
