import type { ReactNode } from "react";

export const metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function AskLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
