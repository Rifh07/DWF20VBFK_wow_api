const multer = require("multer");

exports.uploadBook = (coverFile, bookFile) => {
  //initialisasi multer diskstorage
  //menentukan destionation file diupload
  //menentukan nama file (rename agar tidak ada nama file ganda)
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname === coverFile){
        cb(null, "../client/public/Img/BookCover"); //lokasi penyimpan file
      } else {
        cb(null, "../client/public/Img/Book"); //lokasi penyimpan file
      }
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname); //rename nama file by date now + nama original
    },
  });

  //function untuk filter / validasi file berdasarkan type
  const fileFilter = function (req, file, cb) {
    if (file.fieldname === coverFile) {
      if (!file.originalname.match(/\.(JPG|jpg|JPEG|jpeg|PNG|png)$/)) {
        req.fileValidationError = {
          status: "unsuccess",
          message: "Only image files are allowed!",
        };
        return cb(new Error("Only image files are allowed!"), false);
      }
    }

    if (file.fieldname === bookFile) {
      if (!file.originalname.match(/\.(epub)$/)) {
        req.fileValidationError = {
          status: "unsuccess",
          message: "Only Epub files are allowed!",
        };
        return cb(new Error("Only Epub files are allowed!"), false);
      }
    }

    cb(null, true);
  };

  const sizeInMB = 100;
  const maxSize = sizeInMB * 1000 * 1000; //Maximum file size i MB

  //eksekusi upload multer dan tentukan disk storage, validation dan maxfile size
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).fields([
    {
      name: coverFile,
      maxCount: 1,
    },
    {
      name: bookFile,
      maxCount: 1,
    },
  ]); //fields digunakan karena file yang diupload lebih dari 1 fields

  //middleware handler
  return (req, res, next) => {
    upload(req, res, function (err) {
      //munculkan error jika validasi gagal
      if (req.fileValidationError)
        return res.status(400).send(req.fileValidationError);

      //munculkan error jika file tidak disediakan
      if (!req.files && !err)
        return res.status(400).send({
          status: "unsuccess",
          message: "Please select files to upload",
        });

      //munculkan error jika melebihi max size
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            status: "unsuccess",
            message: "Max file sized 10MB",
          });
        }
        return res.status(400).send(err);
      }

      //jika oke dan aman lanjut ke controller
      //akses nnti pake req.files
      return next();
    });
  };
};