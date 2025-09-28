import { BrowserRouter, Routes, Route } from "react-router-dom"
import Homepage from "./components/Homepage"
import Register from "./components/Register"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        {/* Optional placeholder until you build it */}
        <Route path="/login" element={<div className="p-8">Login Page</div>} />
      </Routes>
    </BrowserRouter>
  )
}
