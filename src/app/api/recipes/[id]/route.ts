import {prisma} from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, context: any) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


  const { id } = await context.params;

  const recipe = await prisma.recipe.findUnique({
    where: { id: Number(id) },
  });

  if (!recipe || recipe.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.ingredient.deleteMany({ where: { recipeId: recipe.id } });
  await prisma.recipe.delete({ where: { id: recipe.id } });

  return NextResponse.json({ message: "Deleted" });
}
