import { Dashboard } from "@/components/dashboard";
export const metadata = { title: "bookings" };
export default function Page() {
  return <Dashboard role="owner" section="bookings" />;
}
