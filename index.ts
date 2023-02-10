import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import productsRouter from "./routers/products";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use('/products', productsRouter);

const run = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect('mongodb://localhost/shop');

  app.listen(port, () => {
    console.log('We are live on ' + port);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

run().catch(console.error);