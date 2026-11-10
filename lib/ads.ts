/**
 * Paid placements for the right rail. Add an entry here to fill the sponsor slot.
 * Creative: 600 x 400 px (3:2) image, shown at 300 x 200. Keep it free of small print.
 * With no active entry the slot shows our own "advertise here" card.
 */
export type Ad = {
  id: string;
  /** Advertiser name, shown as the image's alt text. */
  sponsor: string;
  image: string;
  href: string;
  /** Last day the ad runs (ISO date, inclusive). Leave out for no end date. */
  until?: string;
};

export const ADS: Ad[] = [];

export function activeAd(now = new Date()): Ad | undefined {
  return ADS.find((a) => !a.until || new Date(a.until + "T23:59:59+05:30") >= now);
}
