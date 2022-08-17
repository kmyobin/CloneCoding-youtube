const express = require('express');
const router = express.Router();
//const { Video } = require("../models/User");

const { auth } = require("../middleware/auth");
const multer = require('multer');

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'video/mp4' ) {
      cb(null, true);
      } else {
     
      cb({msg:'mp4 파일만 업로드 가능합니다.'}, false);
     
      }
}

const upload = multer({ storage : storage, fileFilter: fileFilter }).single("file");

//=================================
//             Video
//=================================

router.post('/uploads', (req, res) => {
  // files을 보냄
  // request를 통해 파일받기
  // 비디오를 서버에 저장

  upload(req, res, err => {
    if(err) {
      return res.json({success: false, err})
    }
    return res.json({success: true, url : res.req.file.path, 
      fileName: res.req.file.filename})
    // url : 파일 업로드 하면 업로드 폴더 안에 들어감
  })

})


module.exports = router;
