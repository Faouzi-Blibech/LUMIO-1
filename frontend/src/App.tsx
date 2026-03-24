import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  )
}

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-primary-900 mb-4">
          Lumio
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          ADHD Learning Support Platform
        </p>
        <p className="text-lg text-gray-500 mb-12">
          Empowering students with tools for focus and success
        </p>
        <div className="flex gap-4 justify-center">
          <button className="btn-primary">
            Get Started
          </button>
          <button className="btn-secondary">
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
