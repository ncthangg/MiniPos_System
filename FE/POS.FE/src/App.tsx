import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from './routers/AppRouter'

function App() {

  return (
    <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
      <Router>
        <AppRouter />
      </Router>
    </div>
  )
}

export default App
