const express = require("express");
const router = express.Router();

const {addSocialMedias,getAllMedias,deleteSocialMedia,editSocialMedias} = require("../../Controller/Admin/SocialMedias");


router.post("/addSocialMedias",addSocialMedias);
router.put("/updateSocialMedias",editSocialMedias);
router.get("/getAllSocialMedias",getAllMedias);
router.delete("/deleteSocialMedias/:id",deleteSocialMedia);

module.exports = router;