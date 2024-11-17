import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const IngredientService = {
  async getIngredients({ userId }: { userId: string }) {
    return await prisma.ingredient.findMany({
      where: {
        userId,
      },
      orderBy: {
        name: "asc",
      },
    });
  },

  async checkIngredientExists({
    name,
    userId,
  }: {
    name: string;
    userId: string;
  }) {
    return await prisma.ingredient.findFirst({
      where: {
        name,
        userId,
      },
    });
  },

  async createIngredient({ name, userId }: { name: string; userId: string }) {
    return await prisma.ingredient.create({
      data: {
        name,
        userId,
      },
    });
  },

  async addMultipleIngredients({
    ingredients,
    userId,
  }: {
    ingredients: string[];
    userId: string;
  }) {
    const ingredientsData = ingredients.map((name) => ({
      name,
      userId,
    }));

    return await prisma.ingredient.createMany({
      data: ingredientsData,
    });
  },

  async findIngredientsBySearch({
    search,
    userId,
  }: {
    search: string;
    userId: string;
  }) {
    return await prisma.ingredient.findMany({
      where: {
        name: {
          contains: search,
        },
        userId,
      },
      orderBy: {
        name: "asc",
      },
    });
  },

  async deleteIngredient({ id }: { id: string }) {
    return await prisma.ingredient.delete({
      where: {
        id,
      },
    });
  },

  async updateIngredient({ id, name }: { id: string; name: string }) {
    return await prisma.ingredient.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  },
};

export { IngredientService };
