import './App.css';
import {
  BrowserRouter as Router
} from "react-router-dom";
import RouterTop from './components/RouterTop';

function App() {
  return (
    <div>
      <Router>
        <RouterTop />
      </Router>
    </div>
  );
}

export default App;
