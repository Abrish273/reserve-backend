const Order = require('../model/tourbook');
const Product = require('../model/TourModels');

const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'someRandomValue';
  return { client_secret, amount };
};

const createOrder = async (req, res) => {
    const { items: cartItems } = req.body;
  
    if (!cartItems || cartItems.length < 1) {
      throw new CustomError.BadRequestError('No cart items provided');
    }
  
    let orderItems = [];
    let subtotal = 0;
  
    for (const item of cartItems) {
      const dbProduct = await Product.findOne({ _id: item.product });
      if (!dbProduct) {
        throw new CustomError.NotFoundError(
          `No product with id : ${item.product}`
        );
      }
      
      let price;
      
      // Check if the product has a fixed price
      if (dbProduct.fixedPrice) {
        price = dbProduct.fixedPrice.allInPrice;
      } else {
        // If there's no fixed price, determine the price based on the type of person
        if (item.personType === 'children') {
          price = dbProduct.priceByTypeOfPerson.children.price;
        } else if (item.personType === 'adults') {
          price = dbProduct.priceByTypeOfPerson.adults.price;
        } else if (item.personType === 'oldPeople') {
          price = dbProduct.priceByTypeOfPerson.oldPeople.price;
        } else {
          throw new CustomError.BadRequestError('Invalid person type provided');
        }
      }
      
      // Calculate the subtotal for the product item
      const itemSubtotal = price * item.amount;
      
      const singleOrderItem = {
        amount: item.amount,
        price: itemSubtotal, // Use itemSubtotal as the price for the order item
        title: dbProduct.title,
        content: dbProduct.content,
        images: dbProduct.images,
        product: dbProduct,
      };
      // add item to order
      orderItems.push(singleOrderItem);
      // calculate total
      subtotal += itemSubtotal;
    }
  
    // calculate total
    const total = subtotal;
    // get client secret
    const paymentIntent = await fakeStripeAPI({
      amount: total,
      currency: 'usd',
    });
  
    // create the order with populated orderItems
    const order = await Order.create({
      orderItems,
      total,
      subtotal,
      clientSecret: paymentIntent.client_secret,
      user: req.user.userId,
    });
  
    // Populate product details in orderItems
    await Order.populate(order, { path: 'orderItems.product' });
  
    // send the order details in the response
    res
      .status(StatusCodes.CREATED)
      .json({ order, clientSecret: order.clientSecret });
  };
  

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};
const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = 'paid';
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
