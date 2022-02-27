import axios from "axios";
import { useState } from "react";
import { Alert, Form, Input, Button, Upload, message } from "antd";
import { LoadingOutlined, PieChartFilled, PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import "antd/dist/antd.css";
import styles from './Dashboard.module.css'


function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
  function beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  }

const Dashboard = props => {
    var image_url = "http://localhost:3001/images/"+ localStorage.getItem("image");
    if(localStorage.getItem("image").length === 0)
    {
        image_url = null;
    }

    const token = localStorage.getItem("token");

    const [returnedError, setReturnedError] = useState(false);
  const [errorMessage, setErrorMesasge] = useState("");
  const [returnedSuccess, setReturnedSuccess] = useState(false);
  const [state, setState] = useState({
    imageUrl: image_url,
    loading: false,
    FileList: false
  });

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
 
  const clearImage = props => 
  {
      setState({
        imageUrl: null,
        loading: false,
        FileList: false
      });
      localStorage.setItem("image_name", '');
  }
  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        setState({
          imageUrl,
          loading: false,
          fileList: info.file.originFileObj
        }),
      );
    }
  };

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append("file", state.fileList);
    formData.append("file_url", state.imageUrl);
    formData.append("username", values.username);
    formData.append("password", values.password);
    formData.append("email", values.user.email);
    formData.append("image_name", localStorage.getItem("image"));
    formData.append("user_id", localStorage.getItem("user_id"));
    axios.post('http://localhost:3001/api/updateUser', formData, { headers: {"Authorization" : `Bearer ${token}`} })
        .then(response => {
            if (response.data.status === "error") {
                setReturnedSuccess(false);
                setReturnedError(true);
                setErrorMesasge(response.data.message);
            }
            else if (response.data.status == "success") {
                setReturnedError(false);
                setReturnedSuccess(true);
            }
        })
        .catch(error => {
            setReturnedSuccess(false);
            setReturnedError(true);
            setErrorMesasge("Connection with the server failed");
        });
  };

  const uploadButton = (
    <div>
      {state.loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

    return (
        <div className={styles.container}>
            <h2>Dashboard</h2>
            {(returnedError) ?
                <Alert className={styles.alert} message={errorMessage} type="error" />
                :
                ''}
            {(returnedSuccess) ?
                <Alert className={styles.alert} message="Information Updated" type="success" />
                :
                ''}
            <Form
        className={styles.form}
        initialValues={{
            ["username"]: localStorage.getItem('username'),
            ["email"]: localStorage.getItem('email'),
            ["password"]: localStorage.getItem('password')
          }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input placeholder="Username" defaultValue={localStorage.getItem('username')} />
        </Form.Item>
        <Form.Item
          name={["user", "email"]}
          rules={[
            {
              type: "email",
              required: true,
              message: "Please enter a valid email!",
            },
          ]}
        >
          <Input placeholder="Email" defaultValue={localStorage.getItem('email')} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password placeholder="Password" defaultValue={localStorage.getItem('password')} />
        </Form.Item>
        <ImgCrop>
            <Upload
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            customRequest={dummyRequest}                                   
            onChange={handleChange}
            name="userImage"
            >
                {state.imageUrl ? <img src={state.imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
        </ImgCrop>
        <Button onClick={clearImage} className={styles.button}>Clear Image</Button>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Update Profile
          </Button>
        </Form.Item>
      </Form>
        </div>
    );
}

export default Dashboard;