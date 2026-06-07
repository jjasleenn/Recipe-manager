import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// CREATE RECIPE
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, ingredients } = body;

  const recipe = await prisma.recipe.create({
    data: {
      title,
      description,
      userId,
      ingredients: {
        create: ingredients.map((name: string, index: number) => ({
          name,
          order: index + 1,
        })),
      },
    },
    include: { ingredients: true },
  });

  return NextResponse.json(recipe);
}

// GET ALL RECIPES
export async function GET() {
  const recipes = await prisma.recipe.findMany({
    include: { ingredients: true, user: true },
  });

  return NextResponse.json(recipes);
}
