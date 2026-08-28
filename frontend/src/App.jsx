import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import ScrollToTop from './components/ScrollToTop';
import Homepage from './pages/Homepage';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import ProjectManagement from './pages/ProjectManagement';
import WeSupport from './pages/WeSupport';
import InvitationRegistration from './pages/InvitationRegistration';
import PaymentResult from './pages/PaymentResult';


function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/project-management" element={<ProjectManagement />} />
            <Route path="/we-support" element={<WeSupport />} />
            <Route path="/registration/invitations/:invitationId" element={<InvitationRegistration />} />
            <Route path="/invitations/:invitationId" element={<InvitationRegistration />} />
            <Route path="/payment-success" element={<PaymentResult type="success" />} />
            <Route path="/payment-failed" element={<PaymentResult type="failed" />} />

          </Routes>
        </main>
        <Footer />
        <FloatingButtons />
      </div>
    </Router>
  );
}

export default App;
