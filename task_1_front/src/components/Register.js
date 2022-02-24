import axios from 'axios';
import { useState, useEffect } from 'react';
import { Alert, Form, Input, Button } from 'antd';
import 'antd/dist/antd.css';
import styles from './Register.module.css';

const Register = props => {

    const [ returnedError, setReturnedError ] = useState(false);

    const onFinish = (values) => {
        // axios.post('http://localhost:3001/api/register', values)
        //     .then(response => alert(response))
        //     .catch(error => {
        //         alert('There was an error!', error);
        //     });
        setReturnedError(true);
        const timer = setTimeout(() => {
            setReturnedError(false);
        }, 3000);
    };

    return (
        <div className={styles.container}>
            { (returnedError) ?
            <Alert className={styles.alert} message="Failed to create your account!" type="error" />
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