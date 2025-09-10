"use client";
import Link from "next/link";
import React, { useActionState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { register } from "../actions/auth";
import {Loader2Icon} from "lucide-react"

export default function Page() {
  const [errorMessage, formAction, isPending] = useActionState(
    register,
    undefined
  );
  return (
    <div className="flex min-h-screen items-center justify-center px-12">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-center md:text-2xl text-xl font-semibold">
          Sign up
        </h1>
        <form action={formAction} className="space-y-4">
          <div className="relative h-fit">
            <Input type="email" name="email" required className="pt-7 h-12" />
            <span className="absolute top-1 left-2 text-xs text-muted-foreground">
              EMAIL
            </span>
          </div>
          <div className="relative h-fit">
            <Input
              type="password"
              name="password"
              minLength={8}
              required
              className="pt-7 h-12"
            />
            <span className="absolute top-1 left-2 text-xs text-muted-foreground">
              PASSWORD
            </span>
          </div>
          <Button className="w-full" disabled={isPending} >
            Register {isPending && <Loader2Icon className="animate-spin"/>}
          </Button>
          <p className="text-center">
            Have an account ?{" "}
            <Link href={"/signin"} className="underline text-primary">
              Sign In
            </Link>
          </p>
          {errorMessage && (
            <p className="text-destructive text-center text-sm">
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
