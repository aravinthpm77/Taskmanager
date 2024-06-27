import './App.css';
import { BrowserRouter } from 'react-router-dom';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AllRoute from './router';
function App() {
  return (
    <div className="App">
     <BrowserRouter>
      <AllRoute/>
     
     </BrowserRouter>
     <ToastContainer theme='light'/>
    </div>
  );
}

export default App;
