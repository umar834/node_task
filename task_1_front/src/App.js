import './App.css';
import {
  BrowserRouter as Router
} from "react-router-dom";
import RouterTop from './components/RouterTop';
import { useState } from 'react';
function App() {  
  const templog = localStorage.getItem("loggedin");
  if(typeof(templog) === 'undefined')
  {
    templog = false;
  }
  const [isLoggenIn, setIsLoggedIn] = useState(templog);
  

  const updateLoggedInInfo = (status) =>
  {
    setIsLoggedIn(status);
  }

  return (
    <div>
      <Router>
        <RouterTop loggedIn={isLoggenIn} updateLogin={updateLoggedInInfo} />
      </Router>
    </div>
  );
}

export default App;
