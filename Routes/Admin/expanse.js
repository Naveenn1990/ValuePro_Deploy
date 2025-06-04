const express = require('express');
const router = express.Router();
const expenseController = require('../../Controller/Admin/expanse');


router.post('/AddExpense', expenseController.AddExpense);
router.get('/getExpense', expenseController.getExpense);
router.delete('/deleteExpense/:id', expenseController.deleteExpense);
router.put("/updateExpense",expenseController.updateExpense)
module.exports = router;