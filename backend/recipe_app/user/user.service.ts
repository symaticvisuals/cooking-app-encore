import { PrismaClient } from "@prisma/client";
import { encryptPassword } from "../lib/utils";
import { APIError } from "encore.dev/api";

const prisma = new PrismaClient();

export interface UserServiceResponse {
  success: boolean;
  message: string;
  data: any;
}

const UserService = {
  register: async ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }): Promise<UserServiceResponse> => {
    try {
      const encryptedPassword = await encryptPassword(password);

      const response = await prisma.user.create({
        data: {
          email,
          password: encryptedPassword,
          name,
        },
      });

      return {
        success: true,
        message: "User registered successfully",
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as any).message,
        data: null,
      };
    }
  },

  findByEmail: async (email: string) => {
    return prisma.user.findFirst({
      where: {
        email,
      },
    });
  },
};

export { UserService };
