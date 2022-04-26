import './App.css';
import Navbar from './components/Navbar'
import Realtime from './components/Realtime'
import Predicted from './components/Predicted'
import Sentiment from './components/Sentiment'
import Footer from './components/Footer'

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Realtime/>
      <Predicted/>
      <Sentiment/>
      <Footer/>
    </div>
  );
}

export default App;
