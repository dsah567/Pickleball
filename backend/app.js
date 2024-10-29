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
import adminRoutes from './routes/adminRoutes.js';
import clubRouter from "./routes/clubRoutes.js";
import eventRouter from "./routes/eventRoutes.js";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

app.get("/",(req, res) => {
    res.send('hello world')
  })

//route decleare
app.use('/uploads', express.static('uploads'));  
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/club', clubRouter);
app.use('/api/v1/event', eventRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/order', orderRouter);

export {app}