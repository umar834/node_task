import axios from 'axios';
import { Alert } from 'antd';
import 'antd/dist/antd.css';
import { useState, useEffect } from 'react';
import styles from './VarifyEmail.module.css';

const VarifyEmail = props => {
    const [returnedError, setReturnedError] = useState(false);
    const [errorMessage, setErrorMesasge] = useState('');
    const [returnedSuccess, setReturnedSuccess] = useState(false);
    
    var email = props.email;
    var hash = props.hash;

    useEffect(() => {
        if((email && email.length > 0) && (hash && hash.length > 0))
        {
            const params = {
                email: email,
                hash: hash
            };
            axios.get('http://localhost:3001/api/varify_email', { params })
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
        }
        else 
        {
            setReturnedError(true);
            setErrorMesasge("Invalid Link provided");
        }
    });
    return (
        <div className={styles.container}>
            <h2>Email varification</h2>
            {(returnedError) ?
                <Alert className={styles.alert} message={errorMessage} type="error" />
                :
                ''}
            {(returnedSuccess) ?
                <Alert className={styles.alert} message="Your email has been varified. You can login now!" type="success" />
                :
                ''}
        </div>
    );
}

export default VarifyEmail;