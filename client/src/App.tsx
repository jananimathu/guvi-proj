import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
