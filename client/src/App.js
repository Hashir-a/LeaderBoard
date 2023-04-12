import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Fragment, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
//Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Fragment>
      <Provider store={store}>
        <Router>
          <Alert />
          <Navbar />

          <Routes>
            <Route exact path='/' Component={Landing} />
            <Route exact path='/register' Component={Register} />
            <Route exact path='/login' Component={Login} />
            <Route element={<PrivateRoute />}>
              <Route exact path='/dashboard' Component={Dashboard} />
            </Route>
          </Routes>
        </Router>
      </Provider>
    </Fragment>
  );
};

export default App;
