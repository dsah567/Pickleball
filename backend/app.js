import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()
const allowedOrigins = "http://localhost:5173";
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow credentials (cookies, authorization headers)
}));
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser())

//importing routes
import userRoutes from './routes/userRoutes.js';

app.get("/",(req, res) => {
    res.send('hello world')
  })

//route decleare
app.use('/uploads', express.static('uploads'));  
app.use('/api/v1/user', userRoutes);

export {app}