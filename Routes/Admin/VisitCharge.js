const express =require('express');
const router=express.Router();
const visitController=require('../../Controller/Admin/VisitCharge');

router.post('/addVisitsCharge',visitController.createAndUpdateVisit);
router.get('/getvisitcharge',visitController.getVisitCharge)

router.post('/addCancelCharge',visitController.createAndUpdateCancelCharge);
router.post('/addJobCharge',visitController.createAndUpdateJobCharge);

module.exports=router;