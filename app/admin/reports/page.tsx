import { Dashboard } from "@/components/dashboard";
export const metadata = { title: "reports" };
export default function Page() {
  return <Dashboard role="admin" section="reports" />;
}
