import { brandFonts } from "@/components/brand/fonts";
import "@/components/brand/brand.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className={`up admin-brand ${brandFonts} bg-white`}>{children}</div>;
}
