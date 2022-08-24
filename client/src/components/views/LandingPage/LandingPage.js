import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import {Card, Icon, Avatar, Col, Typography, Row} from 'antd';
import moment from 'moment';
import Axios from 'axios';

const {Title} = Typography;
const {Meta} = Card;

function LandingPage() {


    const [Video, setVideo] = useState([]) // array에 담음

    useEffect(() => { // 돔이 열리자마자 무엇을 할 것인지

        Axios.get('/api/video/getVideos')
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                setVideo(response.data.videos)
            }else{
                alert('비디오 가져오기에 실패 했습니다.')
            }
        })
    }, [])

    const renderCards = Video.map((video, index)=> {

        // duration은 모두 second로 표시되어있으므로 가공함
        var minutes = Math.floor(video.duration/60)
        var seconds = Math.floor((video.duration - minutes * 60))

        return <Col key={index} lg={6} md={8} xs={24}>
        <a href={`/video/post/${video._id}`}> 
            {/*새롭게 추가됨*/}
            <a href={`/video/${video._id}`}>
                <div style={{position: 'relative'}}>
                    <img style={{width:'100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail"/>
                    <div className='duration'>
                        <span>{minutes} : {seconds}</span>
                    </div>
                </div>
            </a>
        </a>
            
        <br />
        <Meta
            avatar={
                <Avatar src={video.writer.image}/>    
            }
            title={video.title}
            description=""
        />

        <span>{video.writer.name}</span> <br />
        <span style={{marginLeft:'3rem'}}> {video.views} views </span> - <span>{moment(video.createdAt).format("MMM Do YY")}</span>

        </Col> 
    })

    return (
        <div style={{width: '85%', margin: '3rem auto'}}>

            <Title level={2}> Recommended </Title>
            <hr />
            <Row gutter={[32,16]}>
                {renderCards}
            </Row>
        </div>

    )
}

export default LandingPage
