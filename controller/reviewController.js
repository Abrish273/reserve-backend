const Review = require("../model/review");
const Product = require("../model/hotelModels");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils/checkPermissions");

const createReview = async (req, res) => {
  const userId = req.user.userId;
  const { product} = req.body;

  const isValidProduct = await Product.findOne({ _id: product});

  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No product with id : ${product}`);
  }

  const alreadySubmitted = await Review.findOne({
    product: product,
    user: userId,
  });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "Already submitted review for this product"
    );
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};


const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name price image ",
  });

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  res.status(StatusCodes.OK).json({ review });
};
const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating,  comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  // checkPermissions(req.user, review.user);

  review.rating = rating;
//   review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  try {
    const { id: reviewId } = req.params;

    // Use findById to directly get the review by its ID
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: `No review found with ID ${reviewId}` });
    }

    // Check permissions if necessary
    // checkPermissions(req.user, review.user);

    // Call the deleteOne method to remove the review
    await Review.deleteOne({ _id: reviewId });

    res.status(StatusCodes.OK).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};


const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
