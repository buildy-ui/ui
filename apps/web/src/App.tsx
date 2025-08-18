import PageBuilder from '@/page/PageBuilder'
import { LandingPage } from '@/page/LandingPage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageBuilder />} />
        <Route path="/land" element={<LandingPage />} />
      </Routes>
    </Router>
  )
}
export default App 