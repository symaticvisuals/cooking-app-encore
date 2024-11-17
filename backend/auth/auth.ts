import { PrismaClient } from "@prisma/client/extension";
import { APIError, Gateway, Header, api } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import log from "encore.dev/log";
import { recipe_app } from "~encore/clients";
import {
  checkPassword,
  generateToken,
  verifyToken,
} from "../recipe_app/lib/utils";

interface LoginParams {
  email: string;
  password: string;
}

export const login = api(
  { expose: true, auth: false, method: "GET", path: "/login" },
  async (params: LoginParams) => {
    const { email, password } = params;

    const { data } = await recipe_app.getUserByEmail({
      email,
    });

    if (!data) {
      throw APIError.unauthenticated("invalid email or password");
    }

    // Check the password
    const validPassword = await checkPassword(password, data.password);

    if (!validPassword) {
      throw APIError.unauthenticated("invalid email or password");
    }

    log.info("User logged in", { email });

    const token = generateToken({ id: data.id, email: data.email });

    return { token: token, user: data };
  }
);

interface AuthParams {
  authorization: Header<"Authorization">;
}

// The function passed to authHandler will be called for all incoming API call that requires authentication.
// Remove if your app does not require authentication.
export const jwtAuthHandler = authHandler(
  async (params: AuthParams): Promise<{ userID: string }> => {
    // ... verify and decode token to get the userID ...
    // ... get user info from database or third party service like Auth0 or Clerk ...

    if (!params.authorization) {
      throw APIError.unauthenticated("no token provided");
    }

    const token = params.authorization.replace("Bearer ", "");

    // Decode the token
    const decoded = verifyToken(token);

    if (!decoded) {
      throw APIError.unauthenticated("invalid token");
    }

    return { userID: decoded.id };
  }
);

export const gateway = new Gateway({ authHandler: jwtAuthHandler });
