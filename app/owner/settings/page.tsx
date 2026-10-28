import { Dashboard } from "@/components/dashboard";
export const metadata = { title: "settings" };
export default function Page() {
  return <Dashboard role="owner" section="settings" />;
}
