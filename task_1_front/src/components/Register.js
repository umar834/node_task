import axios from "axios";
import { useState } from "react";
import { Alert, Form, Input, Button, Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import "antd/dist/antd.css";
import styles from "./Register.module.css";

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

const Register = (props) => {
  const [returnedError, setReturnedError] = useState(false);
  const [errorMessage, setErrorMesasge] = useState("");
  const [returnedSuccess, setReturnedSuccess] = useState(false);
  const [state, setState] = useState({
    imageUrl: false,
    loading: false,
    FileList: false
  });

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

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
    formData.append("username", values.username);
    formData.append("password", values.password);
    formData.append("email", values.user.email);
    axios.post('http://localhost:3001/api/register', formData)
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
      {returnedError ? (
        <Alert className={styles.alert} message={errorMessage} type="error" />
      ) : (
        ""
      )}
      {returnedSuccess ? (
        <Alert
          className={styles.alert}
          message="Your account has been created. Please check your email to activate your account."
          type="success"
        />
      ) : (
        ""
      )}
      <Form
        className={styles.form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <h2>Register</h2>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input type="password" placeholder="Password" />
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
          <Input placeholder="Email" />
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
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
