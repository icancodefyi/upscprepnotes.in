import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://mongodb:mongodb@zoneis.sn2fa.mongodb.net/';
const DB_NAME = 'upscprepnotes';

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
