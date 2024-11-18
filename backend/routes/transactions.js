const { addExpense, getExpenses, deleteExpense } = require('../controllers/expense');
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income');
const { SignUp, Login, getUserById } = require('../controllers/user');

const router = require('express').Router();

router.post('/addIncome', addIncome);
router.get('/getIncomes', getIncomes);
router.delete('/deleteIncome/:id', deleteIncome);
router.post('/addExpense', addExpense);
router.get('/getExpenses', getExpenses);
router.delete('/deleteExpense/:id', deleteExpense);
router.post('/addUser', SignUp);
router.get('/user/:id', getUserById);
router.post('/Login', Login);

module.exports = router;
