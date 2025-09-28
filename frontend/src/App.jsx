import { BrowserRouter, Routes, Route } from "react-router-dom"
import Homepage from "./components/Homepage"
import Register from "./components/Register"
import Login from "./components/Login"
import Landingpage from "./components/Landingpage"
import Premium from "./components/Premium"
import Chart from "./components/chart"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/landingpage" element={<Landingpage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/chart" element={<Chart />} />
      </Routes>
    </BrowserRouter>
  )
}
