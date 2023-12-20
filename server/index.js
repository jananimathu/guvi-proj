import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from './routes/user.js'

const app = express()
const port = process.env.PORT
console.log('dbpass:', process.env.DBPASSWORD, process.env.PORT, process.env.PASSSECRET);
const uri = `mongodb+srv://mjananimatheswaran28:${process.env.DBPASSWORD}@cluster0.dypdawt.mongodb.net/?retryWrites=true&w=majority`;

app.use(express.json({ limit: "30mb", extended: "true" }));
app.use(express.urlencoded({ limit: "30mb", extended: "true" }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use('/user', userRoutes);

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(port, () => console.log(`Server running on port:${port}`)))
    .catch((error) => console.log(error.message)); 