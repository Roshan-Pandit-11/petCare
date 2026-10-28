import { Dashboard } from "@/components/dashboard";
export const metadata = { title: "pets" };
export default function Page() {
  return <Dashboard role="owner" section="pets" />;
}
