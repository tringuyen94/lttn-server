const express = require('express');
const categoriesRouter = require('./categories.router');
const productsRouter = require('./products.router');
const userRouter = require('./users.router');
const brandRouter = require('./brands.router');
const projectRouter = require('./projects.router');
const videoRouter = require('./video.router');
const authRouter = require('./auth.router');
const counterRouter = require('./counter.router');
const router = express.Router();

router.use('/categories', categoriesRouter);
router.use('/auth', authRouter);
router.use('/products', productsRouter);
router.use('/users', userRouter);
router.use('/brands', brandRouter);
router.use('/projects', projectRouter);
router.use('/video', videoRouter);
router.use('/counter', counterRouter);

module.exports = router;
