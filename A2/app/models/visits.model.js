module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      company_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'required'],
      },
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'required'],
      },
      latitude: {
        type: String,
      },
      longitude: {
        type: String,
      },
      is_active: {
        type: Number,
        enum: [1, 0],
        default: 1,
        required: [true, 'required'],
      }
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model("visits", schema);
};