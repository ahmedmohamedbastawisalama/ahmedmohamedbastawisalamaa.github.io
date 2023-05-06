module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            token: String,
            email: {
                type: String
            },
            phone: {
                type: String
            },
            createdAt: {
                type: Date,
                expires: '10m',
                default: Date.now
            }
        }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("tokens", schema);
};