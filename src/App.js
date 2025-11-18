import React from "react";
import MainDashboard from "./Components/Home/MainDashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Report from "./Components/Reports/Reports";


function App() {
  return (
    <>     
      
       <BrowserRouter>
       <Routes>
        <Route path="/" element={<MainDashboard />}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/report" element={<Report/>}/>




       </Routes>
       
       
       </BrowserRouter>
    </>
  );
}

export default App;
