import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRouter from "./constants/ProtectedRouter";
import "./App.css";
import Login from "./components/UserDetails/Login/Login";
import Register from "./components/UserDetails/Register/Register";
import Home from "./components/Pages/Home/Home";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRouter />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
