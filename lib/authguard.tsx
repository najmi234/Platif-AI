"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function withRole(Component: any, allowedRoles: string[]) {
  return function ProtectedComponent(props: any) {
    const router = useRouter();

    useEffect(() => {
      const user = localStorage.getItem("user");
      if (!user) {
        router.push("/login");
        return;
      }

      const parsedUser = JSON.parse(user);

      if (!allowedRoles.includes(parsedUser.role)) {
        // Kalau role tidak sesuai, arahkan ke halaman default role
        if (parsedUser.role === "admin") {
          router.push("/penjualan");
        } else if (parsedUser.role === "operator") {
          router.push("/pembelian");
        }
      }
    }, [router]);

    return <Component {...props} />;
  };
}

// khusus untuk login & signup
export function withoutAuth(Component: any) {
  return function PublicComponent(props: any) {
    const router = useRouter();

    useEffect(() => {
      const user = localStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user);
        // sudah login → arahkan sesuai role
        if (parsedUser.role === "admin") {
          router.push("/penjualan");
        } else if (parsedUser.role === "operator") {
          router.push("/pembelian");
        }
      }
    }, [router]);

    return <Component {...props} />;
  };
}
