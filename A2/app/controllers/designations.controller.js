const mongoose = require("mongoose");

const db = require("../models");
const Designations = db['designations'];

exports.createDesignations = async (req, res) => {
    try {
        const ObjectId = mongoose.Types.ObjectId;
        let user_id = ObjectId(req.user.id);
        req.body.user_id = user_id;

        let company_id = ObjectId(req.user.company_id);
        req.body.company_id = company_id;

        const designations = new Designations(req.body);
        const data = await designations.save(designations);
        res.status(201).send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
};

exports.getCompanyDesignations = async (req, res) => {
    try {
        const ObjectId = mongoose.Types.ObjectId;
        const data = await Designations.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'users'
                },
            },
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
                    company_id: ObjectId(req.user.company_id),
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