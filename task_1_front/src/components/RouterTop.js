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
                    <Link className={styles.link} to="/register">Register</Link>
                    <Link className={styles.link} to="/login">login</Link>
                </nav>
                <Outlet />
            </div>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/email_varify" element={<VarifyEmail email={searchParams.get('email')} hash={searchParams.get('hash')} />} />
            </Routes>
        </div>
    );
}

export default RouterTop;