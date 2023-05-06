require("dotenv").config();

const jwt = require("../helpers/jwt/index");

var fs = require("fs");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = require("../models");
const uploadFile = require("../middlewares/upload");

var QRCode = require("qrcode");
var base64ToImage = require("base64-to-image");

exports.updateProfile = async (req, res) => {
  try {
    const id = req.user.id;

    const user = await db[req.params.document].findById(id);

    if (!user) {
      res.status(404).send({
        message: "No user found.",
      });
    } else {
      delete req.body.password;

      db[req.params.document]
        .findByIdAndUpdate(id, req.body, {
          useFindAndModify: false,
          runValidators: true,
        })
        .then(async (data) => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update with id=${id}`,
            });
          } else {
            const user = await db[req.params.document].findById(id);

            res.send({
              access_token: jwt.accessTokenEncode(user),
              refresh_token: jwt.refreshTokenEncode(user),
              user: user,
            });
          }
        })
        .catch((error) => {
          var message = error.message;
          if (error.code == 11000) {
            message = "Email already exist.";
          }
          res.status(500).send({
            message: message || "Error updating with id=" + id,
          });
        });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const id = req.user.id;

    const user = await db[req.params.document].findById(id);

    if (!user) {
      res.status(404).send({
        message: "No user found.",
      });
    } else {
      const match = await bcrypt.compare(req.body.old_password, user.password);
      if (match) {
        bcrypt.hash(
          req.body.password,
          saltRounds,
          async function (error, hash) {
            db[req.params.document]
              .findByIdAndUpdate(
                id,
                {
                  password: hash,
                },
                {
                  useFindAndModify: false,
                  runValidators: true,
                }
              )
              .then((data) => {
                if (!data) {
                  res.status(404).send({
                    message: `Cannot update with id=${id}`,
                  });
                } else {
                  res.send(data);
                }
              })
              .catch((error) => {
                res.status(500).send({
                  message: error.message || "Error updating with id=" + id,
                });
              });
          }
        );
      } else {
        res.status(400).send({
          message: `Incorrect old password.`,
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.updateCompanyPassword = async (req, res) => {
  try {
    const id = req.query.id;
    const user = await db[req.params.document].findById(id);

    if (!user) {
      res.status(404).send({
        message: "No user found.",
      });
    } else {
      if (req.user.role_id == 1 && req.user.company_id == user.company_id) {
        bcrypt.hash(
          req.body.password,
          saltRounds,
          async function (error, hash) {
            db[req.params.document]
              .findByIdAndUpdate(
                id,
                {
                  password: hash,
                },
                {
                  useFindAndModify: false,
                  runValidators: true,
                }
              )
              .then((data) => {
                if (!data) {
                  res.status(404).send({
                    message: `Cannot update with id=${id}`,
                  });
                } else {
                  res.send(data);
                }
              })
              .catch((error) => {
                res.status(500).send({
                  message: error.message || "Error updating with id=" + id,
                });
              });
          }
        );
      } else {
        res.status(400).send({
          message: `You are not allowed to perform this action.`,
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.qr = async (req, res) => {
  try {
    let text = String(req.user.company_id);
    let qr = process.env.APP_URL + "scan/" + req.user.company_id;

    const base64Str = await QRCode.toDataURL(qr);

    if (!fs.existsSync(__basedir + "/app/storage/qr/")) {
      fs.mkdirSync(__basedir + "/app/storage/qr/");
    }

    var path = __basedir + "/app/storage/qr/";
    var optionalObj = {
      fileName: text,
      type: "png",
    };

    let result = base64ToImage(base64Str, path, optionalObj);

    res.send({
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.updateProfilePhoto = async (req, res) => {
  try {
    if (!fs.existsSync(__basedir + "/app/storage/qr/")) {
      fs.mkdirSync(__basedir + "/app/storage/qr/");
    }

    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({
        message: "Please upload a file!",
      });
    }

    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
      file: req.file.originalname,
    });
  } catch (error) {
    if (error.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${error}`,
    });
  }
};

exports.getFilesList = async (req, res) => {
  const directoryPath = __basedir + "/app/storage/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

exports.download = async (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/app/storage/qr/";

  res.download(directoryPath + fileName, fileName, (error) => {
    if (error) {
      res.status(500).send({
        message: "Could not download the file. " + error,
      });
    }
  });
};
