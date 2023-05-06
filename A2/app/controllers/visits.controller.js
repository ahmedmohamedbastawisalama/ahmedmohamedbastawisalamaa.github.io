require("dotenv").config();

const mongoose = require("mongoose");

const db = require("../models");
const Visits = db['visits'];
const Users = db['users'];

exports.createVisit = async (req, res) => {
    try {

        if (!req.body.company_id) {
            res.status(400).send({
                message: "Company field is required."
            });
            return;
        }

        req.body.company_id = req.body.company_id.replace(process.env.APP_URL+"scan/", "");

        const users = await Users.find({
            company_id: req.body.company_id,
            _id: req.user.id
        });

        if (!users.length) {
            res.status(400).send({
                message: "This is not a valid QR code."
            });
            return;
        }

        const ObjectId = mongoose.Types.ObjectId;
        let user_id = ObjectId(req.user.id);
        req.body.user_id = user_id;

        let company_id = ObjectId(req.body.company_id);
        req.body.company_id = company_id;

        const visits = new Visits(req.body);
        const data = await visits.save(visits);
        res.status(201).send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
};

exports.getVisits = async (req, res) => {
    try {
        const ObjectId = mongoose.Types.ObjectId;
        const data = await Visits.aggregate([
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
                    user_id: ObjectId(req.user.id)
                }
            }
        ]).sort({ createdAt: -1 });
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

exports.getCompanyVisits = async (req, res) => {
    try {

        const inputDate = new Date(req.query.date);
        const nextInputDate = inputDate.addDays(1);

        const ObjectId = mongoose.Types.ObjectId;
        const data = await Visits.aggregate([
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
                    createdAt: {
                        $gte: inputDate,
                        $lt: nextInputDate
                    }
                }
            }
        ]).sort({ createdAt: -1 });
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

Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};