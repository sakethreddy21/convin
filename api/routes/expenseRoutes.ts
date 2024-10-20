import express from 'express';
import { addExpense, getAllExpenses , getUserExpenses, downloadBalanceSheet} from '../controllers/expenseController';
import { authMiddleware } from '../middlewares/authMiddleware'; // Import the auth middleware

const router = express.Router();

// Apply the authMiddleware to the addExpense route
router.post('/', authMiddleware, addExpense);
router.get('/', getAllExpenses)
router.get('/user/:userId', authMiddleware,getUserExpenses); // Get individual user expenses
router.get('/download-balance-sheet', downloadBalanceSheet);


export default router;
