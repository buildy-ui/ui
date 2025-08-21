import { LandingPage, FeaturesPage } from '@/page'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/" element={<FeaturesPage />} />
      </Routes>
    </Router>
  )
}
export default App 