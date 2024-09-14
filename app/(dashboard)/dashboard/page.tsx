"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut } from "lucide-react";
import { NextPage } from "next";
import { signOut } from "next-auth/react";
import { ReactElement, useState } from "react";

const Dashboard: NextPage = (): ReactElement => {
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  const { toast } = useToast();
  return (
    <div>
      <h1>Dashboard</h1>
      <Button
        variant={"secondary"}
        onClick={async () => {
          setIsSigningOut(true);
          try {
            await signOut();
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "There was a problem with your request.",
            });
          } finally {
            setIsSigningOut(false);
          }
        }}
      >
        {isSigningOut ? (
          <Loader2 className="animate-spin h-4 w-4" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
        Signout
      </Button>
    </div>
  );
};

export default Dashboard;
