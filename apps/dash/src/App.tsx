import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@/providers/ThemeProvider'
import { Dashboard } from '@/layouts'
import { Home, Stat, Blank, _404, Login, Register, CrudCreate, CrudList, Flow, Draw } from '@/page'
import { lesseUITheme } from '@ui8kit/theme' // isNavFixed: true
import { ItemsList, NewItem, Tools, QDrantList, QDrantGraph } from "./page/brain";

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
          <Route path="/brain/items" element={<Dashboard page={ItemsList} />} />
          <Route path="/brain/new-item" element={<Dashboard page={NewItem} />} />
          <Route path="/brain" element={<Dashboard page={Tools} />} />
          <Route path="/brain/qdrant" element={<Dashboard page={QDrantList} />} />
          <Route path="/brain/qdrant-graph" element={<Dashboard page={QDrantGraph} />} />
          <Route path="/flow" element={<Dashboard page={Flow} />} />
          <Route path="/draw" element={<Dashboard page={Draw} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App 