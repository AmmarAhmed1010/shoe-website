import { Suspense } from "react";
import { Storefront } from "@/components/storefront";
export default function Page() {
  return (
    <Suspense fallback={<p className="loading">Opening the rack…</p>}>
      <Storefront page="home" />
    </Suspense>
  );
}
