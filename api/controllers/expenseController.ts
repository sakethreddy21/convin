import { Request, Response } from 'express';
import Expense from '../models/Expense';
import User from '../models/user'; 
import { Parser } from 'json2csv';  
export const addExpense = async (req: Request, res: Response) => {
  const { title, amount, userEmail, participants, splitMethod, specificAmounts, percentages } = req.body;

  try {

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

  
    const participantDocs = await Promise.all(
      participants.map(async (p: any) => {
        const participant = await User.findOne({ email: p.email });
        if (!participant) {
          throw new Error(`Participant with email ${p.email} not found`);
        }
        return {
          ...p,
          userID: participant._id, 
        };
      })
    );

    if (splitMethod === 'percentage' && percentages.reduce((a: any, b: any) => a + b, 0) !== 100) {
      return res.status(400).json({ message: 'Percentages must add up to 100' });
    }

    // Create a new expense
    const expense = new Expense({
      title,
      amount,
      userID: user._id, 
      participants: participantDocs, 
      splitMethod,
      specificAmounts,
      percentages,
    });

   
    await expense.save();

    res.status(201).json({ message: 'Expense added successfully', expense });
  } catch (error:any) {
    res.status(400).json({ message: 'Error adding expense', error: error.message });
  }
};

export const getUserExpenses = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const expenses = await Expense.find({ participants: userId });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user expenses', error });
  }
};

export const getAllExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find().populate('participants');
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving expenses', error });
  }
};

export const downloadBalanceSheet = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find().populate('participants');

    // Format expenses for CSV
    const csvFields = ['amount', 'participants', 'splitMethod', 'specificAmounts', 'percentages'];
    const json2csvParser = new Parser({ fields: csvFields });
    const csv = json2csvParser.parse(expenses);

    // Send the CSV file
    res.header('Content-Type', 'text/csv');
    res.attachment('balance_sheet.csv');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Error downloading balance sheet', error });
  }
};
