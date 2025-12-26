require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoute = require("./routes/authRoute");
const errorHandler = require("./middlewares/errorHandler");
const productRoute = require("./routes/productRoute");
const salesRoute = require("./routes/salesRoute");

const app = express();

//connect database
connectDB(process.env.MONGODB_URI);

// Global middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // change to frontend url
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

//route
app.use("/auth", authRoute);
app.use("/product", productRoute);
app.use("/sales", salesRoute);

//error handler
app.use(errorHandler);

// listen to server
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
