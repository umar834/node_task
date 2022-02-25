import { Form, Input, Button, Alert } from 'antd';
import 'antd/dist/antd.css';
import styles from './Dashboard.module.css'

const Dashboard = props => {
    return (
        <div className={styles.container}>
            <h2>Dashboard</h2>
            <h3><b>Name:</b> {localStorage.getItem('username')}</h3>
            <h3><b>Email address:</b> {localStorage.getItem('email')}</h3>
            <Button type="primary" className="login-form-button">
                Update Profile
            </Button>
        </div>
    );
}

export default Dashboard;