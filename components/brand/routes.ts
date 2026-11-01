/**
 * Routes already on the new brand. They render their own Nav and Footer through <BrandShell>,
 * so AppShell skips the old header, footer, banner and floating buttons for them.
 * Add a route here when its page is redesigned.
 */
export const BRAND_ROUTES = ["/try"];

export function isBrandRoute(pathname: string | null | undefined) {
  if (!pathname) return false;
  return BRAND_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}
