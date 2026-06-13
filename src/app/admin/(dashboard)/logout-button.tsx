"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={async () => {
        await signOut({ redirect: false });
        window.location.href = "/admin/login";
      }}
      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
      title="Logout"
    >
      <LogOut className="w-5 h-5" />
    </button>
  );
}
