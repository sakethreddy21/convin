import { Schema, model, Document } from 'mongoose';

// Define an interface representing an expense document in MongoDB
interface IExpense extends Document {
  title: string;  // Title of the expense
  amount: number; // Total amount for the expense
  userID: Schema.Types.ObjectId; // Reference to the user who created the expense
  participants: {
    userID: Schema.Types.ObjectId; // Reference to the user
    amount: number; // Amount owed by the participant
  }[]; // Array of participants
  splitMethod: 'equal' | 'exact' | 'percentage'; // Method of splitting the expense
  createdAt?: Date; // Optional created date
  updatedAt?: Date; // Optional updated date
}

// Create the Expense schema
const expenseSchema = new Schema<IExpense>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0, // Amount must be a positive number
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    participants: [
      {
        userID: {
          type: Schema.Types.ObjectId,
          ref: 'User', // Reference to the User model
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          min: 0, // Amount must be a positive number
        },
      },
    ],
    splitMethod: {
      type: String,
      enum: ['equal', 'exact', 'percentage'], // Allowed split methods
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  }
);

// Create and export the Expense model
const Expense = model<IExpense>('Expense', expenseSchema);

export default Expense;
