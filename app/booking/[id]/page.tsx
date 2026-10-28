import { BookingFlow } from "@/components/booking-flow";
export const metadata = { title: "Booking request" };
export default function Page() {
  return <BookingFlow mode="booking" />;
}
