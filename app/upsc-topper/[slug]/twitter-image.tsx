export { default } from "./opengraph-image";
export const alt = "UPSC topper marksheet";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;
export async function generateStaticParams() {
  return [];
}
