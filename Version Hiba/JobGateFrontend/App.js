import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes,Link, useParams, useNavigate } from 'react-router-dom';
import './App.css';
import DashboardLayout from './components/DashboardLayout';
import ForumList from './components/User';
import LoginPage from './components/login';
import SignUpTalent from './components/signuptalent';
import SignUpRecruteur from './components/signuprecruteur';
import TestQrCode from './components/test';
import Forum2 from './components/event/forum2';
import Candidates from './components/Candidates';
import 'leaflet/dist/leaflet.css';

function App() {
  let token = localStorage.getItem("token-login")
  //navigate = Redirection vers page Authentification
  let navigate = useNavigate()
  setTimeout(()=>{
    localStorage.removeItem("token-login")
    localStorage.removeItem("user")
    navigate("/login")
  },900000)
  return (
    
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/user' element={<ForumList/>}/>
        <Route path='/Recruteur' element={<DashboardLayout/>}/>
        <Route path='/Test' element={<TestQrCode/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup-talent' element={<SignUpTalent/>}/>
        <Route path='/signup-recruteur' element={<SignUpRecruteur/>}/>
        <Route path='/event/:nom' element={<Forum2/>}/>
        <Route path="/Candidates/:forumId" element={<Candidates />} />
        </Routes>

    
  );
}

export default App;