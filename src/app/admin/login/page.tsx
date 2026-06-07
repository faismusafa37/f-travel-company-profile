"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Login successful");
        router.push("/admin");
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="space-y-2 text-center pb-8 pt-8">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="F Travel Logo" className="h-16 w-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">F-Travel Admin</CardTitle>
          <CardDescription>Enter your credentials to access the CMS</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@ftravel.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in to Dashboard"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-slate-100 py-4">
          <p className="text-sm text-slate-500">Secure CMS Access</p>
        </CardFooter>
      </Card>
    </div>
  );
}
