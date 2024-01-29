import { Schema, model } from "mongoose";

// Document interface
interface User {
  name: string;
  email: string;
  password: string;
}
interface Category {
  name: string;
  isEditable: Boolean;
  icon: string;
  color: string;
  user: Object;
}

// Schema
const schema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const schema2 = new Schema<Category>({
  name: { type: String, required: true },
  isEditable: { type: Boolean, required: true, default:true },
  color: { type: String, required: true, code: String },
  icon: { type: String, required: true, symbol:String },
  user: { type: Schema.Types.ObjectId,ref:"User", required: true },
});

const User=  model("User", schema)
const Category=  model("Product", schema2)

export {User, Category}
