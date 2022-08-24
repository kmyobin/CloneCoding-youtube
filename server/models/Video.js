const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
   writer : {
    // 비디오 업로느하는 사람
    type: Schema.Types.ObjectId, // writer의 id를 넣음
    // schema 형식의 id로 넣으면 User에 있는 모든 정보를 가져올 수 있음(name, email, password ...)
    ref: 'User'
   },
   title : {
    type: String,
    
   },
   description : {
    type: String
   },
   privacy : {
    type: Number
   },
   filePath : {
    type: String
   },
   category : {
    type: String
   },
   views: {
    type: Number,
    default : 0 // 조회수는 0부터 시작
   },
   duration : {
    type: String
   },
   thumbnail : {
    type: String
   }
}, { timestamps : true}) // 만든 날 표시

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }