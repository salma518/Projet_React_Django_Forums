import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes,Link, useParams } from 'react-router-dom';
import './App.css';
import DashboardLayout from './components/DashboardLayout';
import ForumList from './components/User';
import LoginPage from './components/login';
import SignUpTalent from './components/signuptalent';
import SignUpRecruteur from './components/signuprecruteur';
import TestQrCode from './components/test';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/user' element={<ForumList/>}/>
        <Route path='/Recruteur' element={<DashboardLayout/>}/>
        <Route path='/Test' element={<TestQrCode/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup-talent' element={<SignUpTalent/>}/>
        <Route path='/signup-recruteur' element={<SignUpRecruteur/>}/>
      </Routes>

    </Router>
    
  );
}

export default App;