const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        console.log("MongoDB Connected Successfully!");
    } catch (error) {
        console.log("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;