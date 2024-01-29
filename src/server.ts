import express from 'express'
import connect = require('./DB/connect')
import userRouter from './routes/route'
import 'dotenv/config'

const app = express();
const PORT = 5000
app.use(express.json())
app.use('/',userRouter);

app.get('/',(req,res)=>{
    res.send("Hello")
})

const start = async () => {
    try {
      // connectDB
      await connect.connectDB(process.env.MONGO_URL || '');
      console.log("DB is connected")
      app.listen(PORT, () => console.log(`Server is listening port ${PORT}...`));
    } catch (error) {
      console.log(error);
    }
  };
  
  start();