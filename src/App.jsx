import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import ReportIssue from './components/ReportIssue';
import MyReports from './components/MyReports';
import NotFound from './components/NotFound';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="header">
          <h1>SpotFixr</h1>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/submit">Report Issue</Link>
              </li>
              <li>
                <Link to="/my-reports">My Reports</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/submit" element={<ReportIssue />} />
            <Route path="/my-reports" element={<MyReports />} />
            <Route path="*" element={<NotFound />} />
          </Routes>          
        </main>
        <footer>
          <p>2025 SpotFixr</p>
        </footer>
      </div>
    </BrowserRouter>

  )
}

export default App;