import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "prisma/schema.prisma",
  "lib/prisma.ts",
  "lib/auth.ts",
  "app/api/health/route.ts",
  "app/api/auth/login/route.ts",
  "app/api/bookings/route.ts",
  "app/api/pets/route.ts",
  ".env.example",
];
const missing = required.filter(
  (file) => !fs.existsSync(path.join(root, file)),
);
if (missing.length) {
  console.error("Missing backend files:", missing.join(", "));
  process.exit(1);
}
const schema = fs.readFileSync(path.join(root, "prisma/schema.prisma"), "utf8");
for (const model of [
  "User",
  "Pet",
  "SitterProfile",
  "Booking",
  "Payment",
  "StayUpdate",
  "Review",
  "Message",
  "Notification",
  "Report",
]) {
  if (!schema.includes(`model ${model} {`)) {
    console.error(`Missing Prisma model: ${model}`);
    process.exit(1);
  }
}
console.log("Backend structure check passed.");
