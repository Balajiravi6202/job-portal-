import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()


const dbmongoose = mongoose.connect(process.env.dbconnection,{
    
    useNewUrlParser: true,
    useUnifiedTopology: true,

})

export default dbmongoose