import axios from 'axios';
import { Form, Input, Button, Alert } from 'antd';
import 'antd/dist/antd.css';
import styles from './ForgotPassword.module.css'
import { useState } from 'react';

const ForgotPassword = props => {

    const [returnedError, setReturnedError] = useState(false);
    const [errorMessage, setErrorMesasge] = useState('');
    const [returnedSuccess, setReturnedSuccess] = useState(false);

    const onFinish = (values) => {
        axios.post('http://localhost:3001/api/forgotpassword', values)
            .then(response => {
                if (response.data.status === "error") {
                    setReturnedSuccess(false);
                    setReturnedError(true);
                    setErrorMesasge(response.data.message);
                }
                else if (response.data.status === "success") {
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

    return (
        <div>
            {(returnedError) ?
                <Alert className={styles.alert} message={errorMessage} type="error" />
                :
                ''}
            {(returnedSuccess) ?
                <Alert className={styles.alert} message="Reset password link has been sent to the email" type="success" />
                :
                ''}
            <Form className={styles.form}
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <h2>Enter your email address</h2>
                <Form.Item
                    name="email"
                    rules={[{type: 'email', required: true, message: 'Please input a valid Email!' }]}
                >
                    <Input placeholder="Email" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Send Link
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default ForgotPassword;