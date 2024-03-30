const News = require("../model/news");

// Controller function to create a new news article
const createNews = async (req, res) => {
  try {
    const { title, category, content } = req.body;
    const news = new News({ title, category, content });
    const savedNews = await news.save();
    res.status(201).json(savedNews);
  } catch (error) {
    console.error("Error creating news:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to get all news articles
const getAllNews = async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to get a news article by its ID
const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }
    res.json(news);
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to update a news article by its ID
const updateNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, content } = req.body;
    const updatedNews = await News.findByIdAndUpdate(
      id,
      { title, category, content },
      { new: true }
    );
    if (!updatedNews) {
      return res.status(404).json({ error: "News not found" });
    }
    res.json(updatedNews);
  } catch (error) {
    console.error("Error updating news by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to delete a news article by its ID
const deleteNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNews = await News.findByIdAndDelete(id);
    if (!deletedNews) {
      return res.status(404).json({ error: "News not found" });
    }
    res.json({ message: "News deleted successfully" });
  } catch (error) {
    console.error("Error deleting news by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createNews,
  getAllNews,
  getNewsById,
  updateNewsById,
  deleteNewsById,
};
