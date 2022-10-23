import "./assets/main.css";
import Home from "./components/Home";
import {BrowserRouter} from 'react-router-dom';
import Navbar from "./components/Navbar";

function App() {
  return (
    // <BrowserRouter>
    <div className="container">
      <Navbar />
    </div>
    // </BrowserRouter>
  );
}

export default App;
