import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import multer from "multer";  // Import multer for file upload handling
import path from "path";

// Controller functions (assuming they are in controllers/file.controller.js)
import { downloadFile, uploadFiles } from "./controllers/file.controller.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4040;
const DB_NAME = "sharingApp";
const MONGODB_URL = `${process.env.MONGODB_URL}/${DB_NAME}`;

// MongoDB Connection
(async () => {
    try {
        const connectionInstance = await mongoose.connect(MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected at host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit process if the connection fails
    }
})();

// Middleware
app.use(cors({
    origin: "http://localhost:5173", // Make sure this matches your client URL
    credentials: true,  // Allow credentials in CORS requests
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

// File Upload Setup using Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");  // Folder where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Ensure unique filename
    },
});

const upload = multer({ storage: storage });  // Multer upload middleware

// Routes
app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

app.post("/upload", upload.single("file"), uploadFiles); // Upload route
app.get("/file/:fileId", downloadFile);  // File download route

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
