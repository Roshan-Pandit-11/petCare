import { BookingFlow } from "@/components/booking-flow";
export const metadata = { title: "Demo checkout" };
export default function Page() {
  return <BookingFlow mode="checkout" />;
}
