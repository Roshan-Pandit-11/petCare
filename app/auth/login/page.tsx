import { AuthForm } from "@/components/auth-form";
export const metadata = { title: "Login" };
export default function Page() {
  return <AuthForm mode="login" />;
}
