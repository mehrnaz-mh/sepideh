import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  async function loginAction(formData: FormData) {
    "use server";

    try {
      await signIn("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        redirectTo: "/admin",
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect("/admin/login?error=invalid");
      }
      throw error;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md border border-border bg-background p-8">
        <h1 className="font-serif text-3xl">Admin Login</h1>
        <p className="mt-2 text-sm text-muted">Sepideh Mihanparast Dashboard</p>

        <form action={loginAction} className="mt-8 space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required className="mt-2" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="mt-2"
            />
          </div>
          <Button type="submit" variant="gold" className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
