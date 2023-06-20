const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  // limits: {
  //   fileSize: 20 * 1024 * 1024, // 20MB
  // },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

function checkFileType(file, cb) {
  // // Allowed ext
  // const filetypes = /jpeg|jpg|png|gif|mp4|mov|wmv|flv|avi|webm|mkv|pdf/;
  // // Check ext
  // const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  // // Check mime
  // const mimetype = filetypes.test(file.mimetype);

  // if (mimetype && extname) {
  //   return cb(null, true);
  // } else {
  //   cb("Error: Only jpeg, jpg, png, gif, mp4, mov, wmv, flv, avi, webm, mkv, pdf files.");
  // }
  return cb(null, true);
}

module.exports = { upload };