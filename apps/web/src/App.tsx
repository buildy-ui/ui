import PageBuilder from '@/page/PageBuilder'
import { LandingPage } from '@/page/LandingPage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/blocks" element={<PageBuilder />} />
      </Routes>
    </Router>
  )
}
export default App 