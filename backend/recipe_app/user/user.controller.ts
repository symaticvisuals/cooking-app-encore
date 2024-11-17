import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";

import log from "encore.dev/log";
import { UserService, UserServiceResponse } from "./user.service";

export const getDashboardData = api(
  {
    expose: true, // Is publicly accessible
    auth: true, // Auth handler validation is required
    method: "GET",
    path: "/admin",
  },
  async (): Promise<DashboardData> => {
    const userID = getAuthData()!.userID;
    return { value: "Admin stuff" };
  }
);

export const registerUser = api(
  {
    expose: true,
    auth: false,
    method: "POST",
    path: "/user/register",
  },
  async (params: {
    email: string;
    password: string;
    name: string;
  }): Promise<UserServiceResponse> => {
    if (!params.email || !params.password || !params.name) {
      throw APIError.invalidArgument("Missing required fields");
    }

    const checkUser = await UserService.findByEmail(params.email);
    if (checkUser) {
      throw APIError.alreadyExists("User already exists");
    }
    const result = await UserService.register(params);
    return result;
  }
);

export const getUserByEmail = api(
  {
    expose: true,
    auth: false,
    method: "GET",
    path: "/user/:email",
  },
  async (params: { email: string }): Promise<UserServiceResponse> => {
    const result = await UserService.findByEmail(params.email);
    console.log("result", result);
    log.info("result", result);
    return {
      success: true,
      message: "User found",
      data: result,
    };
  }
);

interface DashboardData {
  value: string;
}
