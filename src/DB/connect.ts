import mongoose from 'mongoose'

export const connectDB = (url:string) => {
  console.log("Wait for DB connection")
    return mongoose.connect(url)
  }
  
