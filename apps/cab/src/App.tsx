import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@/providers/ThemeProvider'
import { Dashboard, Chatboard } from '@/layouts'
import { Home, Stat, Login, Register, CrudCreate, CrudList, Billing, Team, Integrations, BlocksForm, ChatPage, ChatSetting, ImagePage, CodePage } from '@/page'
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
          <Route path="/chat" element={<Chatboard page={ChatPage} />} />
          <Route path="/chat/setting" element={<Chatboard page={ChatSetting} />} />
          <Route path="/chat/image" element={<Chatboard page={ImagePage} />} />
          <Route path="/chat/code" element={<Chatboard page={CodePage} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App 