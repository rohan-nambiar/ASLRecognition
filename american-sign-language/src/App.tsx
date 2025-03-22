import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ASLRecognition from './pages/ASLRecognition';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-800">ASL Recognition</h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link to="/" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                    Home
                  </Link>
                  <Link to="/recognize" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                    Recognize ASL
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<div className="text-center py-12">
              <h2 className="text-3xl font-bold text-gray-900">Welcome to ASL Recognition</h2>
              <p className="mt-4 text-xl text-gray-600">Learn and practice American Sign Language</p>
            </div>} />
            <Route path="/recognize" element={<ASLRecognition />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
