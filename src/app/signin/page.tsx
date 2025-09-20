"use client";
import Link from "next/link";
import React, { useActionState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { authenticate } from "../actions/auth";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";

export default function Page() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
  return (
    <div className="flex min-h-screen items-center justify-center px-12 w-full">
      <div className="w-full max-w-sm space-y-12">
        <div className="space-y-3 text-center">
          <Image
            alt="Co Cocreate"
            src={"/logo.png"}
            height={40}
            width={40}
            className="m-auto mb-4"
          />
          <p className="text-xl">
            Presenting Cocreate by{" "}
            <span className="font-bold">Tushar Bhatt</span>
          </p>
          <p className="italic">Design Together, in Real-Time.</p>
        </div>
        <form action={formAction} className="space-y-4">
          <h1 className="text-center text-xl font-semibold">Welcome back, Sign In</h1>
          <div className="relative h-fit">
            <Input type="email" name="email" required className="pt-4 h-12" />
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
          <Button className="w-full" disabled={isPending}>
            SignIn {isPending && <Loader2Icon className="animate-spin" />}
          </Button>
          <p className="text-center">
            No account ?{" "}
            <Link href={"/signup"} className="underline text-primary">
              Sign Up
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
