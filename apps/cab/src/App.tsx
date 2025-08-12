import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@/providers/ThemeProvider'
import { Dashboard } from '@/layouts/Dashboard'
import { Home, Stat } from '@/page'
//import { skyOSTheme } from '@ui8kit/theme' // isNavFixed: false
//import { modernUITheme } from '@ui8kit/theme' // not available isNavFixed
import { lesseUITheme } from '@ui8kit/theme' // isNavFixed: true

function App() {
  return (
    <ThemeProvider theme={lesseUITheme}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard page={Home} />} />
          <Route path="/stat" element={<Dashboard page={Stat} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App 