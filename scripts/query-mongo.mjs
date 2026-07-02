import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://mongodb:mongodb@zoneis.sn2fa.mongodb.net/';
const DB_NAME = 'upscprepnotes';

async function main() {
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;

  // List collections
  const collections = await db.listCollections().toArray();
  console.log('\nCollections:', collections.map(c => c.name));

  // Orders
  const ordersCollection = db.collection('orders');
  const orderCount = await ordersCollection.countDocuments();
  const latestOrders = await ordersCollection.find().sort({ createdAt: -1 }).limit(5).toArray();
  console.log('\n=== ORDERS ===');
  console.log('Total orders:', orderCount);
  console.log('Latest 5 orders:');
  latestOrders.forEach((o, i) => {
    console.log(`\n  Order ${i+1}:`);
    console.log(`    ID: ${o._id}`);
    console.log(`    Email: ${o.email || 'N/A'}`);
    console.log(`    Items: ${JSON.stringify(o.items)}`);
    console.log(`    Total: ₹${o.total}`);
    console.log(`    Status: ${o.status}`);
    console.log(`    Created: ${o.createdAt}`);
    console.log(`    DodoSession: ${o.dodoSessionId || 'N/A'}`);
    console.log(`    Ref: ${o.ref || 'N/A'}`);
  });

  // Customers
  const customersCollection = db.collection('customers');
  const customerCount = await customersCollection.countDocuments();
  const latestCustomers = await customersCollection.find().sort({ createdAt: -1 }).limit(5).toArray();
  console.log('\n=== CUSTOMERS ===');
  console.log('Total customers:', customerCount);
  console.log('Latest 5 customers:');
  latestCustomers.forEach((c, i) => {
    console.log(`\n  Customer ${i+1}:`);
    console.log(`    ID: ${c._id}`);
    console.log(`    Name: ${c.name}`);
    console.log(`    Email: ${c.email}`);
    console.log(`    Product: ${c.product}`);
    console.log(`    Amount: ₹${c.amount}`);
    console.log(`    Phone: ${c.phone || 'N/A'}`);
    console.log(`    UTR: ${c.utr || 'N/A'}`);
    console.log(`    OrderID: ${c.orderId || 'N/A'}`);
    console.log(`    Status: ${c.status}`);
    console.log(`    Created: ${c.createdAt}`);
  });

  await mongoose.disconnect();
  console.log('\nDone.');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
