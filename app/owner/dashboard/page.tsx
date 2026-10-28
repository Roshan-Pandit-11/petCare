import { Dashboard } from "@/components/dashboard";
export const metadata = { title: "dashboard" };
export default function Page() {
  return <Dashboard role="owner" section="dashboard" />;
}
