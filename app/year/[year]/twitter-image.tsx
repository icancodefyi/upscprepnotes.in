export { default } from "./opengraph-image";
export const alt = "UPSC toppers by year";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;
export async function generateStaticParams() {
  return [];
}
