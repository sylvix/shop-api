import express from "express";
import fileDb from "../fileDb";
import {ProductWithoutId} from "../types";
import { imagesUpload } from "../multer";

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  const products = await fileDb.getItems();
  res.send(products);
});

productsRouter.get('/:id', async (req, res) => {
  const products = await fileDb.getItems();
  const product = products.find(product => product.id === req.params.id);

  if (!product) {
    return res.sendStatus(404);
  }

  res.send(product);
});

productsRouter.post('/', imagesUpload.single('image'), async (req, res) => {
  if (!req.body.title || !req.body.price) {
    return res.status(400).send({error: 'All fields are required'});
  }

  const productData: ProductWithoutId = {
    title: req.body.title,
    description: req.body.description,
    price: parseFloat(req.body.price),
    image: req.file ? req.file.filename : null,
  };

  const savedProduct = await fileDb.addItem(productData);

  res.send(savedProduct);
});

export default productsRouter;