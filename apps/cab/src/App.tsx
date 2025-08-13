import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@/providers/ThemeProvider'
import { Dashboard } from '@/layouts/Dashboard'
import { Home, Stat, Login, Register, CrudCreate, CrudList, Billing, Team, Integrations, BlocksCategory, BlocksForm } from '@/page'
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
          <Route path="/login" element={<Dashboard page={Login} />} />
          <Route path="/register" element={<Dashboard page={Register} />} />
          <Route path="/billing" element={<Dashboard page={Billing} />} />
          <Route path="/team" element={<Dashboard page={Team} />} />
          <Route path="/integrations" element={<Dashboard page={Integrations} />} />
          <Route path="/crud/create" element={<Dashboard page={CrudCreate} />} />
          <Route path="/crud/list" element={<Dashboard page={CrudList} />} />
          <Route path="/blocks" element={<Dashboard page={BlocksForm} />} />
          <Route path="/blocks/:category" element={<Dashboard page={BlocksCategory} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App 