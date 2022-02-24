import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet
} from "react-router-dom";
import Register from './components/Register';
import Login from './components/Login';
import styles from './app.module.css'

function App() {
  return (
    <div>
      
      <Router>
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
