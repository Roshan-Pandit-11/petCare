import { Dashboard } from "@/components/dashboard";
export const metadata = { title: "Add a pet" };
export default function Page() {
  return <Dashboard role="owner" section="new" />;
}
