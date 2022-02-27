import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Outlet,
    useSearchParams
} from "react-router-dom";

import Register from './Register';
import Login from './Login';
import VarifyEmail from './VarifyEmail';
import styles from '../app.module.css'
import Dashboard from "./Dashboard";
import axios from 'axios';
import ForgotPassword from "./ForgotPassword";

const RouterTop = props => {
    const [searchParams, setSearchParams] = useSearchParams();

    return (
        <div>
            <div style={{ display: "flex", justifyContent: 'center' }}>
                <nav
                    style={{
                        padding: "1rem",
                    }}
                >
                    {props.loggedIn? 
                    <button className={styles.link} onClick={() => 
                        {
                            props.updateLogin(false);
                            localStorage.clear();
                            axios.post('http://localhost:3001/api/logout', null);
                        }
                    }>Logout</button>
                    :
                    <div>
                        <Link className={styles.link} to="/register">Register</Link>
                        <Link className={styles.link} to="/main">login</Link>
                    </div>
                    }
                </nav>
                <Outlet />
            </div>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/email_varify" element={<VarifyEmail email={searchParams.get('email')} hash={searchParams.get('hash')} />} />
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                <Route path="/main" element={props.loggedIn ? <Dashboard /> : <Login loggedIn={props.loggedIn} updateLogin={props.updateLogin}/>}/>
            </Routes>
        </div>
    );
}

export default RouterTop;