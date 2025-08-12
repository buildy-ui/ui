import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@/providers/ThemeProvider'
import { Dashboard } from '@/layouts/Dashboard'
import { Home } from '@/page/Home'
import { skyOSTheme } from '@ui8kit/theme'

function App() {
  return (
    <ThemeProvider theme={skyOSTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard page={Home} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App 