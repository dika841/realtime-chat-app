'use client'
import { Button } from "@/components/ui/button";
import { NextPage } from "next";
import { signOut } from "next-auth/react";
import { ReactElement } from "react";

const Dashboard:NextPage = ():ReactElement=> {
    return <div>
        <h1>
        Dashboard
        </h1>
        <Button variant={"secondary"} onClick={() => signOut({ callbackUrl: "/login" })}>Signout</Button>
        </div>
};

export default Dashboard;
