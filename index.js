import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./utils/db.js";

//Import All Routes
import userRoutes from "./routes/user.routes.js";


const app = express();
dotenv.config();


app.use(
    cors({
        origin: process.env.BASE_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const port = process.env.PORT || 3000;

app.get("/", (req, res)=> {
    res.send("Hello World");
})

app.route("/saksham").get((req, res)=> {
    res.send("Hello Saksham");
})

db();

app.use("/api/v1/users", userRoutes);

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
})