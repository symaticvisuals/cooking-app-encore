import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { IngredientService } from "./ingredient.service";

export const getIngredients = api(
  {
    path: "/ingredients",
    method: "GET",
    auth: true,
    expose: true,
  },
  async () => {
    const { userID } = getAuthData()!;
    const result = await IngredientService.getIngredients({
      userId: userID,
    });
    if (result.length === 0) {
      throw APIError.notFound("No ingredients found");
    }
    return result;
  }
);

export const addIngredient = api(
  {
    path: "/ingredient",
    method: "POST",
    auth: true,
    expose: true,
  },
  async (params: { name: string }) => {
    const { userID } = getAuthData()!;
    const result = await IngredientService.createIngredient({
      userId: userID,
      name: params.name,
    });
    return result;
  }
);

export const addIngredients = api(
  {
    path: "/ingredients",
    method: "POST",
    auth: true,
    expose: true,
  },
  async (params: { ingredients: string[] }) => {
    const { userID } = getAuthData()!;
    const result = await IngredientService.addMultipleIngredients({
      userId: userID,
      ingredients: params.ingredients,
    });
    return result;
  }
);

export const deleteIngredient = api(
  {
    path: "/ingredient/:id",
    method: "DELETE",
    auth: true,
    expose: true,
  },
  async (params: { id: string }) => {
    const result = await IngredientService.deleteIngredient({
      id: params.id,
    });
    return result;
  }
);

export const updateIngredient = api(
  {
    path: "/ingredient/:id",
    method: "PUT",
    auth: true,
    expose: true,
  },
  async (params: { id: string; name: string }) => {
    const result = await IngredientService.updateIngredient({
      id: params.id,
      name: params.name,
    });
    return result;
  }
);
