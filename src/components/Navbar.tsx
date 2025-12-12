"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SyncButton from "./SyncButton";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const linkClass = (path: string) =>
    `w-full text-center px-4 py-3 rounded-md font-medium 
     ${
       pathname === path
         ? "bg-blue-600 text-white"
         : "bg-gray-800 text-gray-300"
     }
    `;

  return (
    <nav className="w-full bg-gray-900 p-3 space-y-3">
      {/* Row 1 */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/budget" className={linkClass("/budget")}>
          Budget
        </Link>

        <SyncButton />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/dashboard" className={linkClass("/dashboard")}>
          Dashboard
        </Link>

        <button
          onClick={() => {
            useAuthStore.getState().logout(); // 👈 real logout
            router.push("/login"); // 👈 redirect
          }}
          className="w-full px-4 py-3 bg-red-600 text-white rounded-md font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
