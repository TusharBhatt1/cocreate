"use client";
import { Button } from "~/components/ui/button";
import { signOutUser } from "../actions/auth";
import { useSession } from "next-auth/react";

export default function Page() {
  return (
    <div>
      Dashboard
      <Button onClick={() => signOutUser()}>Signout</Button>
    </div>
  );
}
