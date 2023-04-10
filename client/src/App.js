import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Switch,
} from 'react-router-dom';
import { Fragment } from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

const App = () => (
  <Fragment>
    <Router>
      <Navbar />
      <Routes>
        <Route exact path='/' Component={Landing} />
        <Route exact path='/register' Component={Register} />
        <Route exact path='/login' Component={Login} />
      </Routes>
    </Router>
  </Fragment>
);

export default App;
