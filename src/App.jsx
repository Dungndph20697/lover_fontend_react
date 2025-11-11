import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
