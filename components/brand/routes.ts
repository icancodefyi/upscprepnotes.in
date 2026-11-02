/**
 * Routes already on the new brand. They render their own Nav and Footer through <BrandShell>,
 * so AppShell skips the old header, footer, banner and floating buttons for them.
 * Add a route here when its page is redesigned.
 */
export const BRAND_ROUTES = ["/", "/upsc-topper", "/compare", "/free-materials", "/toppers", "/year", "/optional", "/content", "/store", "/download", "/search", "/current-affairs", "/pyq", "/resources", "/about", "/contact", "/privacy-policy", "/terms", "/disclaimer", "/faq", "/report-preview", "/advertise"];

export function isBrandRoute(pathname: string | null | undefined) {
  if (!pathname) return false;
  return BRAND_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}

/**
 * Routes with their own frame: the AI chat and admin.
 * Only these skip the brand frame (the chat keeps its own header; admin its own layout). Anything else, including any 404, is on the brand.
 */
export function isLegacyRoute(pathname: string | null | undefined) {
  if (!pathname) return false;
  return pathname === "/ask" || pathname.startsWith("/ask/") || pathname === "/admin" || pathname.startsWith("/admin/");
}
