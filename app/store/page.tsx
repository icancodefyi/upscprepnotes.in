import StoreClient from "@/components/store/StoreClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Store",
  description:
    "Curated UPSC topper resources — strategy compilations, answer copies, and more. Instant PDF delivery.",
};

export default function StorePage() {
  return <StoreClient />;
}
