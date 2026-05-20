import { Routes, Route } from 'react-router-dom';
import CV from './pages/CV';
import Portfolio from './pages/Portfolio';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CV />} />
      <Route path="/proyectos" element={<Portfolio />} />
    </Routes>
  );
}
