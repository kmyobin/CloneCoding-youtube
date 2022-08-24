const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

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

router.post('/uploadVideo', (req, res) => {
  // 비디오 정보들 저장

  const video = new Video(req.body) // 모든 정보를 담음 . 클라이언트에서 받은 모든 variables가 req.body에 담김

  video.save((err, doc) => {
    if(err) return res.json({success: false, err})
    res.status(200).json({success:true})
  }) // mongoDB에 저장
  
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

router.get('/getVideos', (req, res) => {
  // 비디오를 DB에서 가져와 클라이언트에 보냄

  Video.find() // collections에 있는 모든 video 가져옴
  .populate('writer') // 모든 writer 정보 가져옴
  // 안하면 writer의 id만 가져옴
  .exec((err, videos)=> {
    if(err) return res.status(400).send(err)
    else res.status(200).json({success:true, videos})
  })
  
})


module.exports = router;
