const express = require('express');
const router = express.Router();
const expenseController = require('../../Controller/Admin/expenseType');



router.post('/AddExpenseType', expenseController.AddExpenseType);
router.get('/getExpenseType', expenseController.getExpenseType);
router.delete('/deleteExpenseType/:id/:authId', expenseController.deleteExpenseType);
router.put("/updateExpenseType",expenseController.updateExpenseType)
module.exports = router;