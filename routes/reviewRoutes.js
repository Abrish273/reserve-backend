const express = require("express");
const router = express.Router();
// const path = require("path");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require("../controller/reviewController");

router.route("/").post(authenticateUser, createReview)
.get(getAllReviews);

router
  .route("/:id")
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(
    [authenticateUser],
    deleteReview
  );

module.exports = router;
