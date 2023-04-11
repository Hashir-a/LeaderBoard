import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Fragment } from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
//Redux
import { Provider } from 'react-redux';
import store from './store';

const App = () => (
  <Fragment>
    <Provider store={store}>
      <Router>
        <Alert />
        <Navbar />

        <Routes>
          <Route exact path='/' Component={Landing} />
          <Route exact path='/register' Component={Register} />
          <Route exact path='/login' Component={Login} />
        </Routes>
      </Router>
    </Provider>
  </Fragment>
);

export default App;
