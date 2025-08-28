const VisitModel = require('../../Modal/Admin/VisitCharge');

class Visit {
    async createAndUpdateVisit(req, res) {
        try {
            let { visitcharge } = req.body;
            let check = await VisitModel.findOne();
            if (check) {
                check.visitcharge = visitcharge
                check = await check.save();
            } else {
                check = await VisitModel.create({ visitcharge });
            }
            return res.status(200).json({ message: "success", data: check });
        } catch (error) {
            console.log(error);


        }
    }

    async createAndUpdateCancelCharge(req, res) {
        try {
            let { cancelCharge } = req.body;
            let check = await VisitModel.findOne();
            if (check) {
                check.cancelCharge = cancelCharge
                check = await check.save();
            } else {
                check = await VisitModel.create({ cancelCharge });
            }
            return res.status(200).json({ message: "success", data: check });
        } catch (error) {
            console.log(error);

        }
    }

    async createAndUpdateJobCharge(req, res) {
        try {
            let { jobCharge } = req.body;
            let check = await VisitModel.findOne();
            if (check) {
                check.jobCharge = jobCharge
                check = await check.save();
            } else {
                check = await VisitModel.create({ jobCharge });
            }
            return res.status(200).json({ message: "success", data: check });
        } catch (error) {
            console.log(error);

        }
    }

    async getVisitCharge(req, res) {
        try {
            let check = await VisitModel.findOne();
            return res.status(200).json({ message: "success", data: check });
        } catch (error) {
            console.log(error);

        }
    }

}
module.exports = new Visit();