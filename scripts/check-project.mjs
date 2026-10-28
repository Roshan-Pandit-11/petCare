import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
const root = process.cwd();
const required = [
  "app/layout.tsx",
  "app/page.tsx",
  "app/sitters/page.tsx",
  "app/sitters/[id]/page.tsx",
  "app/owner/dashboard/page.tsx",
  "app/owner/pets/new/page.tsx",
  "app/sitter/dashboard/page.tsx",
  "app/admin/dashboard/page.tsx",
  "components/header.tsx",
  "components/marketplace.tsx",
  "components/dashboard.tsx",
  "components/booking-flow.tsx",
  "lib/data.ts",
  "app/globals.css",
];
let failed = false;
for (const file of required) {
  try {
    await stat(path.join(root, file));
    console.log("✓", file);
  } catch {
    console.error("✗ Missing", file);
    failed = true;
  }
}
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && !["node_modules", ".next"].includes(e.name))
      await walk(p);
    else if (e.isFile() && /\.(tsx?|mjs)$/.test(e.name)) {
      const text = await readFile(p, "utf8");
      if (
        !p.endsWith("scripts/check-project.mjs") &&
        text.includes('href="#"')
      ) {
        console.error("✗ Placeholder link in", path.relative(root, p));
        failed = true;
      }
      if (!p.endsWith("scripts/check-project.mjs") && text.includes("TODO")) {
        console.error("! TODO marker in", path.relative(root, p));
      }
    }
  }
}
await walk(root);
if (failed) process.exit(1);
console.log(
  "\nProject structure check passed. This is not a TypeScript or Next.js production build.",
);
