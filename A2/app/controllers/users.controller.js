const mongoose = require("mongoose");

const db = require("../models");
const Users = db['users'];

exports.getCompanyUsers = async (req, res) => {
    try {
        const ObjectId = mongoose.Types.ObjectId;
        const data = await Users.aggregate([
            {
                $lookup: {
                    from: 'companies',
                    localField: 'company_id',
                    foreignField: '_id',
                    as: 'companies'
                }
            },
            {
                $match: {
                    company_id: ObjectId(req.user.company_id)
                }
            }
        ]).sort({createdAt:-1});
        if (!data) {
            res.status(400).send({
                message: `No data`
            });
        } else {
            res.send(data);
        }
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
};