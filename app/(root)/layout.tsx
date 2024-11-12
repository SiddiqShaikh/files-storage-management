import React from "react";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/appwrite/actions/user.action";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return redirect("/signin");

  return (
    <main className="flex h-screen">
      <Sidebar {...currentUser} />
      <section className="flex flex-1 flex-col h-full">
        <MobileNavigation {...currentUser} />
        <Header accountId={currentUser?.accountId} userId={currentUser.$id} />
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
};

export default Layout;
