import { promises as fs } from 'fs';
import express from 'express';
import { ProductMutation } from '../types';
import { imagesUpload } from '../multer';
import Product from '../models/Product';
import mongoose, { HydratedDocument } from 'mongoose';
import auth from '../middleware/auth';
import permit from '../middleware/permit';

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('category');
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

productsRouter.post('/', auth, permit('admin'), imagesUpload.single('image'), async (req, res, next) => {
  try {
    const product = await Product.create({
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      price: parseFloat(req.body.price),
      image: req.file ? req.file.filename : null,
    });

    return res.send(product);
  } catch (e) {
    if (req.file) {
      await fs.unlink(req.file.path);
    }

    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

productsRouter.patch('/:id', imagesUpload.single('image'), async (req, res, next) => {
  const product: HydratedDocument<ProductMutation> | null = await Product.findById(req.params.id);

  if (!product) {
    return res.sendStatus(404);
  }

  product.title = req.body.title;
  product.price = req.body.price;
  product.description = req.body.description;
  product.image = req.file ? req.file.filename : null;

  try {
    await product.save();
    return res.send(product);
  } catch (e) {
    if (req.file) {
      await fs.unlink(req.file.path);
    }

    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

export default productsRouter;