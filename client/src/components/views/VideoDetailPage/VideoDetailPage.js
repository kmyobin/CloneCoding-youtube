import React, { useEffect, useState } from 'react'
import {Row, Col, List, Avatar} from 'antd';
import Axios from 'axios';


// video는 18, side는 6

function VideoDetailPage(props) {
    const videoId = props.match.params.videoId // App.js에서 설정함
    const variable = {videoId : videoId}

    const [VideoDetail, setVideoDetail] = useState([]) // array
  
  useEffect(() => {    
    Axios.post('/api/video/getVideoDetail', variable)
    .then(response => {
      if(response.data.success){
        setVideoDetail(response.data.videoDetail)
      }else{
        alert('비디오 정보를 가져오는 데에 실패했습니다.')
      }
    })
  },[])

  if(VideoDetail.writer){
    return (
      <Row gutter={[16,16]}>
        <Col lg={18} xs={24}>

          <div style={{width: '100%', padding: '3rem 4rem'}}>
            <video style={{width:'100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />

            <List.Item
              actions // 좋아요 싫어요
            >
              <List.Item.Meta
                avatar={<Avatar src= {VideoDetail.writer.image}/>}
                title={VideoDetail.writer.name}
                description={VideoDetail.description}
              /> 
            </List.Item>

            {/*Comments*/}
          </div>
        </Col>
        <Col lg={6} xs={24}>
          Side Videos
        </Col>
      </Row>
    )
  } else{
    return (
      <div>... loading</div>
    )
  }


  
}

export default VideoDetailPage