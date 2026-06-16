// Run: IMAGEKIT_PRIVATE_KEY='private_key' node -r dotenv/config scripts/upload-bundle.mjs dotenv_config_path=.env.local
import { mkdirSync, writeFileSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { ImageKit } from "@imagekit/nodejs";

const PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error("IMAGEKIT_PRIVATE_KEY not set. Run with: IMAGEKIT_PRIVATE_KEY='...' node -r dotenv/config scripts/upload-bundle.mjs dotenv_config_path=.env.local");
  process.exit(1);
}

const imagekit = new ImageKit({
  privateKey: PRIVATE_KEY,
});

const FOLDER = "upscprepnotes/bundle-content";
const OUTPUT_FILE = resolve(
  import.meta.dirname,
  "..",
  "data/bundle-content/uploaded-assets.json"
);

const pdfsDir = resolve(import.meta.dirname, "..", "data/bundle-content/output");
const { readdirSync } = await import("fs");

async function uploadPdfs() {
  const files = readdirSync(pdfsDir).filter((f) => f.endsWith(".pdf"));
  const results = [];

  for (const file of files) {
    const filePath = resolve(pdfsDir, file);
    const buffer = readFileSync(filePath);

    console.log(`Uploading: ${file} (${(buffer.length / 1024).toFixed(0)} KB)`);

    try {
      const result = await imagekit.files.upload({
        file: buffer,
        fileName: file,
        folder: FOLDER,
        useUniqueFileName: false,
        overwrite: true,
      });

      results.push({
        fileName: file,
        url: result.url,
        fileId: result.fileId,
        size: result.size,
      });

      console.log(`  ✓ ${result.url}`);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
    }
  }

  writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`\nUpload complete. ${results.length} files uploaded.`);
  console.log(`Results saved to: ${OUTPUT_FILE}`);
}

uploadPdfs().catch(console.error);
