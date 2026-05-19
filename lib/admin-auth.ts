export async function createAdminToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  const payload = {
    passwordHash: hashHex,
    timestamp: Date.now(),
  };

  return btoa(JSON.stringify(payload));
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const payload = JSON.parse(atob(token));
    const { passwordHash, timestamp } = payload;

    if (!passwordHash || !timestamp) return false;

    const encoder = new TextEncoder();
    const data = encoder.encode(process.env.ADMIN_PASSWORD);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const expectedHash = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (passwordHash !== expectedHash) return false;
    if (Date.now() - timestamp > 24 * 60 * 60 * 1000) return false;

    return true;
  } catch {
    return false;
  }
}
