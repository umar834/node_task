import axios from 'axios';
import { useState } from 'react';
import { Alert, Form, Input, Button, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import 'antd/dist/antd.css';
import styles from './Register.module.css';

const Register = props => {
    const [returnedError, setReturnedError] = useState(false);
    const [errorMessage, setErrorMesasge] = useState('');
    const [returnedSuccess, setReturnedSuccess] = useState(false);
    const [state, setState] = useState({
        previewVisible: false,
        previewImage: "",
        fileList: []
      });

    const handleCancel = () => setState({ previewVisible: false });

    const handlePreview = file => {
        this.setState({
          previewImage: file.thumbUrl,
          previewVisible: true
        });
    };

    const handleUpload = ({ fileList }) => {
        setState({ fileList });
    };
    const onFinish = (values) => {
        values.append("file", state.fileList[0].originFileObj);
        axios.post('http://localhost:3001/api/register', values)
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
    const handleSubmit = event => {
        event.preventDefault();
    
        let formData = new FormData();
        // add one or more of your files in FormData
        // again, the original file is located at the `originFileObj` key
        
    
        axios
          .post("http://api.foo.com/bar", formData)
          .then(res => {
            console.log("res", res);
          })
          .catch(err => {
            console.log("err", err);
          });
      };

      const uploadButton = (
        <div>
          <PlusOutlined />
          <div className="ant-upload-text">Upload</div>
        </div>
      );

    return (
        <div className={styles.container}>
            {(returnedError) ?
                <Alert className={styles.alert} message={errorMessage} type="error" />
                :
                ''}
            {(returnedSuccess) ?
                <Alert className={styles.alert} message="Your account has been created. Please check your email to activate your account." type="success" />
                :
                ''}
            <Form className={styles.form}
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <h2>Register</h2>
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                    <Input placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item name={['user', 'email']} rules={[{ type: 'email', required: true, message: 'Please enter a valid email!' }]}>
                    <Input placeholder='Email' />
                </Form.Item>
                <Upload
                    listType="picture-card"
                    fileList={state.fileList}
                    onPreview={handlePreview}
                    onChange={handleUpload}
                    beforeUpload={() => false}
                    >
                    {uploadButton}
                </Upload>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Register;