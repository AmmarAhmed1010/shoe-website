import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Storefront, type PageName } from "@/components/storefront";
const routes = [
  "dashboard",
  "auth",
  "orders",
  "checkout",
  "order-confirmation",
];
export function generateStaticParams() {
  return routes.map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title:
      (
        {
          dashboard: "All pairs",
          auth: "Your account",
          orders: "Your demo orders",
          checkout: "Reserve your pair",
          "order-confirmation": "Your reservation",
        } as Record<string, string>
      )[slug] || "Page",
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!routes.includes(slug)) notFound();
  return (
    <Suspense fallback={<p className="loading">Opening the rack…</p>}>
      <Storefront page={slug as PageName} />
    </Suspense>
  );
}
