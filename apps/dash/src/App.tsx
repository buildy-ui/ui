import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@/providers/ThemeProvider'
import { Dashboard } from '@/layouts'
import { Home, Stat, Blank, _404, Login, Register, CrudCreate, CrudList } from '@/page'
import { lesseUITheme } from '@ui8kit/theme' // isNavFixed: true

function App() {
  return (
    <ThemeProvider theme={lesseUITheme}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard page={Home} />} />
          <Route path="*" element={<Dashboard page={_404} />} />
          <Route path="/stat" element={<Dashboard page={Stat} />} />
          <Route path="/blank" element={<Dashboard page={Blank} />} />
          <Route path="/login" element={<Dashboard page={Login} />} />
          <Route path="/register" element={<Dashboard page={Register} />} />
          <Route path="/crud/create" element={<Dashboard page={CrudCreate} />} />
          <Route path="/crud/list" element={<Dashboard page={CrudList} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App 