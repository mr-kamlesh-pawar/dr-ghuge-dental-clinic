"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import TopBar from "@/components/admin_models/TopBar";
import dynamic from "next/dynamic";

const AdminPageContent = dynamic(
  () => import("@/components/admin_models/AdminPageContent"),
  {
    loading: () => <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>,
  }
);

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const jwtToken = Cookies.get("jwtToken");

    if (!jwtToken) {
      router.push("/admin-login");
      return;
    }

    const validate = async () => {
      const response = await fetch("/api/verify", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        router.push("/admin-login");
      }
    };

    validate();
  }, [router]);

  return (
    <>
      <TopBar />
      <div>
        <AdminPageContent />
      </div>
    </>
  );
}
