import { Dashboard } from "@/components/dashboard";
export const metadata = { title: "favorites" };
export default function Page() {
  return <Dashboard role="owner" section="favorites" />;
}
