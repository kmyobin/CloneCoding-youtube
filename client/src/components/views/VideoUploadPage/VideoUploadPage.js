import React, { useState } from "react";
import {Typography, Button, Form, message, Input, Icon} from 'antd';
import Dropzone from "react-dropzone";
import Axios from "axios";

const { Title } = Typography;
const { TextArea } = Input;

const PrivateOptions = [
  {value : 0, label : "Private"},
  {value : 1, label : "Public"}
]

const CategoryOptions = [
  {value : 0, label : "Film & Animation"},
  {value : 1, label : "Autos & Vehicles"},
  {value : 2, label : "Music"},
  {value : 3, label : "Pets & Animals"},
]


function VideoUploadPage(){
  // state : state 안에다 value들을 저장함

  const [VideoTitle, setVideoTitle] = useState("")
  const [Description, setDescription] = useState("")
  const [Private, setPrviate] = useState(0)
  const [Category, setCategory] = useState("Film & Animation")

  const onTitleChange = (e) => {
    console.log(e.currentTarget) // 타이핑할 때마다 발생하는 e(event)
    setVideoTitle(e.currentTarget.value)
  }

  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value)
  }

  const onPrivateChange = (e) => {
    setPrviate(e.currentTarget.value)
  }

  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value)
  }

  const onDrop = (files) => {
    let formData = new FormData;
    const config = {
      header: {'content-type': 'multipart/form-data'}
    }
    formData.append("file", files[0])

    console.log(files)

    // Axios 이용하여 request를 서버에 보냄
    // 위에 것들 보내주지 않으면 파일에 오류 발생
    Axios.post('/api/video/uploads', formData, config)
    .then(response => {
      if(response.data.success) {
        console.log(response.data);
      }else{
        alert('비디오 업로드에 실패했습니다.')
      }
    })
  }


  return (
    <div style={{maxWidth : '700px', margin:'2rem auto'}}>
      <div style={{textAlign: 'center', marginBottom:'2rem'}}>
        <Title level={2}>Upload Video</Title>
      </div>

      <Form onSubmit>
        <div style={{display:'flex', justifyContent:'space-between'}}>
          {/*Drop Zone*/}
          <Dropzone
          onDrop={onDrop}
          multiple={false} // 한 번에 파일 하나 or 여러개
          maxSize={10000000000}>
          {({getRootProps, getInputProps}) => (
            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray',
              alignItems: 'center', justifyContent: 'center', display : 'flex'}} {...getRootProps()}>
                <Input {...getInputProps()} />
                <Icon type="plus" style={{fontSize:'3rem'}}/>
            </div>
          )}
          </Dropzone>
          
          {/*Thumbnail*/}
          <div>
            <img src alt />
          </div>

        </div>

        <br/>
        <br/>

        <label>Title</label>
        <Input 
          onChange={onTitleChange} 
          value={VideoTitle} 
        />

        <br/>
        <br/>

        <label>Descriptions</label>
        <TextArea
          onChange={onDescriptionChange}
          value = {Description}
        />

        <br/>
        <br/>

        <select onChange={onPrivateChange}>
          {PrivateOptions.map((item, index) => (
            <option key={index} value={item.value}>{item.label}</option>
          ))}
        </select>

        <br/>
        <br/>

        <select onChange={onCategoryChange}>
          {CategoryOptions.map((item, index) => (
            <option key={index} value={item.value}>{item.label}</option>
          ))}
        </select>

        <br/>
        <br/>

        <Button type="primary" size="large" onClick>
          Submit          
        </Button>


      </Form>
    </div>
  )
}

export default VideoUploadPage // 외부에서 쓸 수 있게