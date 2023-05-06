module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      company_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'required'],
      },
      name: {
        type: String,
      },
      email: {
        type: String,
        lowercase: true,
      },
      phone: {
        type: String,
      },
      password: {
        type: String,
        required: [true, 'required']
      },
      gender: {
        type: String,
      },
      role: {
        type: String,
      },
      names: {
        type: String,
      },
      membership: {
        type: String,
      },
      interest: {
        type: String,
      },
      interests: {
        type: String,
      },
      title: {
        type: String,
      },
      role_id: {
        type: Number,
        enum: [1, 2], // 1 = Admin , 2 = Staff
        default: 1
      },
      designation_id: {
        type: String,
      },
      is_active: {
        type: Number,
        enum: [1, 0],
        default: 1,
        required: [true, 'required'],
      },
      is_2factor_auth_enabled: {
        type: Number,
        enum: [1, 0]
      },
      _2factor_auth_type: {
        type: String,
        enum: ['Email', 'Sms'],
      },
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model("users", schema);
};