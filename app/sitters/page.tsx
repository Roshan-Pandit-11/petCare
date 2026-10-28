import { Suspense } from "react";
import type { Metadata } from "next";
import { Marketplace } from "@/components/marketplace";
export const metadata: Metadata = {
  title: "Find a sitter",
  description:
    "Explore sample pet sitter profiles, compare care styles and find a stay.",
};
export default function Sitters() {
  return (
    <Suspense
      fallback={
        <div className="container section">Finding thoughtful sitters…</div>
      }
    >
      <Marketplace />
    </Suspense>
  );
}
