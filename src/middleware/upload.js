const multer = require("multer");

// Set up Multer storage options
// Sử dụng memoryStorage sẽ giúp chúng ta thao tác với các tập tin trước khi lưu 
// vào bộ nhớ hoặc database
const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, "/"); // Specify the destination directory where uploaded files will be stored
  },
});

// Create Multer middleware instance for single file upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // option để quản lý file size, ở đây là maximun file size đc upload
  },
}).single("image"); // phương thức để chỉ đinh cho phép upload 1 hay nhiều file
// với phương thức này đc chỉ định chỉ cho upload 1 file. "image" chính là tên 
// của input bên form(client)  

module.exports = upload;
