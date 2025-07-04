const express =require('express');
const router=express.Router();
const visitController=require('../../Controller/Admin/VisitCharge');

router.post('/addVisitsCharge',visitController.createAndUpdateVisit);
router.get('/getvisitcharge',visitController.getVisitCharge)

module.exports=router;