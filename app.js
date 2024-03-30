require("express-async-errors");

const cors = require("cors");
const express = require("express");

const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connect.js");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userroutes.js");
const venroutes = require("./routes/vendorRoutes.js");
const boaroutes = require("./routes/boatRoute.js");
const carRoutes = require("./routes/carRoute.js");
const hotelRoutes = require("./routes/hotelRoute");
const spaceRoutes = require("./routes/spaceRoute");
const tourRoutes = require("./routes/tourRoute");
const locationRoutes = require("./routes/locationRoute");
const newsRoutes = require("./routes/newsRoute");
const roomRoutes = require("./routes/roomRoute");
const reviewRoutes = require("./routes/reviewRoutes");
const boatbookRoutes = require("./routes/boatbookingRouter");
const carbookingRoutes = require('./routes/carbookingRoute')
const hotelbookingRoutes = require('./routes/hotelbookRouter')
const spacebookingRoutes = require('./routes/spacebookRouter')
const tourbookingRoutes = require('./routes/tourbookRouter')
const roombookingRoutes = require('./routes/roombookingRouter')







// Middleware
const notFoundMiddleware = require("./middleware/not-found.js");
const errorHandlerMiddleware = require("./middleware/error-handler.js");

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, // allow cookies to be sent
};

app.use(cors(corsOptions));
app.use(morgan("tiny"));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser(process.env.JWT_SECRET));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/ven", venroutes);
app.use("/api/v1/boa", boaroutes);
app.use("/api/v1/car", carRoutes);
app.use("/api/v1/hotel", hotelRoutes);
app.use("/api/v1/spaces", spaceRoutes);
app.use("/api/v1/tour", tourRoutes);
app.use("/api/v1/loc", locationRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/room", roomRoutes);
app.use("/api/v1/rev" ,reviewRoutes);
app.use('/api/v1/boatbook',boatbookRoutes);
app.use('/api/v1/carbook/',carbookingRoutes);
app.use('/api/v1/hotelbook/',hotelbookingRoutes);
app.use('/api/v1/spacebook/',spacebookingRoutes);
app.use('/api/v1/tourbook/',tourbookingRoutes);
app.use('/api/v1/roombook/',roombookingRoutes);



app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
