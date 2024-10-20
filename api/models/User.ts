import { Schema, model, Document } from 'mongoose';

// Define an interface representing a user document in MongoDB
interface IUser extends Document {
  name: string;
  email: string;
 mobile:string;
}

// Create the User schema
const userSchema = new Schema<IUser>({
   name: {
    type: String,
    required: true,
    trim: true,
  },
 
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  mobile:{
    type:String,
    required:true,
    trim:true, 
  }
});

// Create and export the User model
const User = model<IUser>('User', userSchema);

export default User;
