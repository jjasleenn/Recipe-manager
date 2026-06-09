import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  console.log("POST /api/recipes HIT");

  try {
    
    const authResult = await auth();
    const userId = authResult.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, description, ingredients } = body;

    if (
      !title ||
      !description ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@clerk.dev`,
        name: null,
      },
    });

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
      include: {
        ingredients: true,
        user: true,
      },
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error: any) {
    console.error("POST ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create recipe",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: true,
        user: true,
      },
    });

    return NextResponse.json(recipes);
  } catch (error: any) {
    console.error("GET ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch recipes",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}