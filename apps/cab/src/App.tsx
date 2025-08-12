import Dashboard from '@/page/Dashboard'
import { ThemeProvider } from '@/providers/ThemeProvider'

function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  )
}

export default App 