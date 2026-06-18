const IK_URL = process.env.NEXT_PUBLIC_IK_URL || "https://ik.imagekit.io/impiclabs";

const LOCAL_TO_IK: Record<string, string> = {
  "/images/products/": "products/",
  "/images/institutes/": "institutes/",
  "/images/sales/": "sales/",
  "/previews/": "previews/",
  "/sample-answers/": "sample-answers/",
  "/qr.png": "qr.png",
};

export function ikUrl(
  localPath: string,
  opts?: { w?: number; h?: number; q?: number; f?: string },
): string {
  let ikPath = localPath;

  for (const [localPrefix, ikPrefix] of Object.entries(LOCAL_TO_IK)) {
    if (localPath.startsWith(localPrefix)) {
      ikPath = ikPrefix + localPath.slice(localPrefix.length);
      break;
    }
  }

  let url = `${IK_URL}/${ikPath}`;

  if (opts && Object.keys(opts).length > 0) {
    const params: string[] = [];
    if (opts.w || opts.h) {
      const w = opts.w ? `w-${opts.w}` : "";
      const h = opts.h ? `h-${opts.h}` : "";
      params.push(`${w}${h ? "," + h : ""}`);
    }
    if (opts.q) params.push(`q-${opts.q}`);
    if (opts.f) params.push(`f-${opts.f}`);
    url += `?tr=${params.join(",")}`;
  }

  return url;
}
