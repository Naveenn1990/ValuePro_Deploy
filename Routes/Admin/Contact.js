const express = require("express");
const router = express.Router();

const {
  addContactPage,
  getAllContactPage,
  editContact,
  deleteContactPage,
} = require("../../Controller/Admin/Contact");

router.post("/addContactPage", addContactPage);
router.put("/updatecontact",editContact)
router.get("/getAllContactPage", getAllContactPage);
router.delete("/deletecontact/:id", deleteContactPage);

module.exports = router;
