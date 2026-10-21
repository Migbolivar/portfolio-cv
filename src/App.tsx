import { Routes, Route } from 'react-router-dom';
import CV from './pages/CV';
import Portfolio from './pages/Portfolio';
import ChatBot from './components/ChatBot';
import SmoothScroll from './components/SmoothScroll';

export default function App() {
  return (
    <>
      <SmoothScroll>
        <Routes>
          <Route path="/" element={<CV />} />
          <Route path="/proyectos" element={<Portfolio />} />
        </Routes>
        <ChatBot />
      </SmoothScroll>
    </>
  );
}
