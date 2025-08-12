import Dashboard from '@/page/Dashboard'
import { ThemeProvider } from '@/providers/ThemeProvider'
//import { skyOSTheme, type SkyOSTheme } from '@ui8kit/theme'
import { lesseUITheme } from '@ui8kit/theme'

function App() {
  return (
    <ThemeProvider theme={lesseUITheme}>
      <Dashboard />
    </ThemeProvider>
  )
}

export default App 