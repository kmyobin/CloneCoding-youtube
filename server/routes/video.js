const express = require('express');
const router = express.Router();
//const { Video } = require("../models/User");

const { auth } = require("../middleware/auth");
const multer = require('multer');
var ffmpeg = require("fluent-ffmpeg");

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

router.post('/thumbnail', (req, res) => {
  // 썸네일 생성 후 비디오 정보(러닝타임) 가져오기

  let filePath = ""
  let fileDuration = ""


  ffmpeg.setFfmpegPath("C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe");
  // 비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.url, function(err, metadata){ // video 넣고나서
    console.dir(metadata);
    console.log(metadata.format.duration);
    fileDuration = metadata.format.duration; // metadata 가져와서 정보 넣기
  })

  // 썸네일 생성
  ffmpeg(req.body.url) // client에서 온 video 저장 경로
  .on('filenames', function (filenames) {
    console.log('Will generate ' + filenames.join(', '))
    console.log(filenames)

    filePath = "uploads/thumbnails/"+filenames[0]
  })
  .on('end', function () { // 썸네일 생성 후 작업
    console.log ('Screenshots taken');
    return res.json({ success: true, url: filePath, fileDuration: fileDuration})
  })
  .on('error', function (err){
    console.error(err);
    return res.json({success: false, err});
  })
  .screenshots({
    // Will take screenshots at 20%, 40%, 60%, 80% of the video
    count: 3, // 3개의 썸네일 촬영 가능
    folder: 'uploads/thumbnails',
    size: '320x240',
    filename: 'thumbnail-%b.png' // %b : input basename(확장자 제외)
  })

})


module.exports = router;
