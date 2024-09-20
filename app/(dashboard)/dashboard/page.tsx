"use client";
import { NextPage } from "next";
import { ReactElement } from "react";

const Dashboard: NextPage = (): ReactElement => {


  return (
    <div className="text-slate-700 flex-1 flex flex-col justify-center h-full items-center">
      <h1 className="text-xl font-semibold">You need a partner to start chat</h1>
      <h2  className="text-lg text-red-400">Add a friend first</h2>   
    </div>
  );
};

export default Dashboard;
