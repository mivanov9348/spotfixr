import './App.css'

function App() {
  return (
    <div className="App">
      <header className="header">
        <h1>SpotFixr</h1>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/submit">Report</a></li>
            <li><a href="/my-reports">My Reports</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <section className="intro">
          <h2>Welcome</h2>
          <p>Report here!</p>
          <button className="submit-button">Report</button>
        </section>
      </main>
      <footer>
        <p>SpotFixr</p>
      </footer>
    </div>
  )
}

export default App;