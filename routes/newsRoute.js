const express = require("express");
const router = express.Router();
const newsController = require("../controller/newsController");

// Route to create a new news article
router.post("/", newsController.createNews);

// Route to get all news articles
router.get("/", newsController.getAllNews);

// Route to get a news article by its ID
router.get("/:id", newsController.getNewsById);

// Route to update a news article by its ID
router.put("/:id", newsController.updateNewsById);

// Route to delete a news article by its ID
router.delete("/:id", newsController.deleteNewsById);

module.exports = router;
