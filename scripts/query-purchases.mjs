import mongoose from 'mongoose';

// Run with: node --env-file=.env.local scripts/query-purchases.mjs
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('Set MONGODB_URI (node --env-file=.env.local ...)');
const DB_NAME = process.env.DB_NAME || 'upscprepnotes';

async function main() {
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
  const db = mongoose.connection.db;
  const purchasesCollection = db.collection('purchases');
  const count = await purchasesCollection.countDocuments();
  console.log('Total purchases:', count);
  const latest = await purchasesCollection.find().sort({ createdAt: -1 }).limit(3).toArray();
  latest.forEach((p, i) => {
    console.log(`\nPurchase ${i+1}:`, JSON.stringify(p, null, 2));
  });
  await mongoose.disconnect();
}
main().catch(err => { console.error(err); process.exit(1); });
