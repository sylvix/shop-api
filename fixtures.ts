import crypto from 'crypto';
import mongoose from 'mongoose';
import config from './config';
import Category from './models/Category';
import Product from './models/Product';
import User from './models/User';

const run = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection('categories');
    await db.dropCollection('products');
    await db.dropCollection('users');
  } catch (e) {
    console.log('Collections were not present, skipping drop...');
  }

  const [cpuCategory, ssdCategory] = await Category.create({
    title: 'CPUs',
    description: 'Central Processor Units'
  }, {
    title: 'SSDs',
    description: 'Solid State Drives'
  });

  await Product.create({
    title: 'Intel Core i7 12700K',
    price: 350,
    category: cpuCategory._id,
    image: 'fixtures/cpu.jpg'
  }, {
    title: 'Samsung 990 Pro 1TB',
    price: 170,
    category: ssdCategory._id,
    image: 'fixtures/ssd.jpg'
  });

  await User.create({
    username: 'user',
    password: '1@345qWert',
    token: crypto.randomUUID(),
  }, {
    username: 'admin',
    password: '1@345qWert',
    token: crypto.randomUUID(),
    role: 'admin'
  });

  await db.close();
};

void run();