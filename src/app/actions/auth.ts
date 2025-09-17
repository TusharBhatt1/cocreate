"use server";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { signUpSchema } from "~/schema";
import { db } from "~/server/db";
import { redirect } from "next/navigation";
import { signIn, signOut } from "~/server/auth";
import { AuthError } from "next-auth";

export const register = async (
  prevState: string | undefined,
  formData: FormData
) => {
  try {
    const { email, password } = await signUpSchema.parseAsync({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (user) return "User already exists";

    const hash = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        email,
        password: hash,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return error.errors.map((e) => e.message).join(", ");
    }
    throw new Error("REGISTERATION FAILED");
  }
  redirect("/signin");
};

export const authenticate = async (
  prevState: string | undefined,
  formData: FormData
) => {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid Credentials";
        default:
          return "Something went wrong";
      }
    }
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut({
      redirectTo: "/signin",
    });
  } catch (error) {
    throw error;
  }
};
