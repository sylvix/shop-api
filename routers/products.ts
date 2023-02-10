import express from "express";
import {ProductWithoutId} from "../types";
import { imagesUpload } from "../multer";
import Product from "../models/Product";

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    return res.send(products);
  } catch {
    return res.sendStatus(500);
  }
});

productsRouter.get('/:id', async (req, res) => {
  try {
    const result = await Product.findById(req.params.id);

    if (!result) {
      return res.sendStatus(404);
    }

    return res.send(result);
  } catch {
    return res.sendStatus(500);
  }
});

productsRouter.post('/', imagesUpload.single('image'), async (req, res) => {
  try {
    const productData: ProductWithoutId = {
      title: req.body.title,
      description: req.body.description,
      price: parseFloat(req.body.price),
      image: req.file ? req.file.filename : null,
    };

    const product = new Product(productData);

    try {
      await product.save();
      return res.send(product);
    } catch (error) {
      return res.status(400).send(error);
    }
  } catch (e) {
    return res.sendStatus(500);
  }
});

export default productsRouter;