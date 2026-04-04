import Hero from './sections/Hero';
import StatsSection from './sections/StatsSection';
import CodeQuality from './sections/CodeQuality';
import Skills from './sections/Skills';
import TechStack from './sections/TechStack';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import About from './sections/About';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import ScrollProgress from './components/ScrollProgress';
import ScrollToTop from './components/ScrollToTop';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <ScrollToTop />
      <Chatbot />
      
      <main>
        <Hero />
        <StatsSection />
        <CodeQuality />
        <Skills />
        <TechStack />
        <Experience />
        <Projects />
        <About />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
