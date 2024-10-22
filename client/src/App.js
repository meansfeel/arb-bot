import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Login from './components/Login';
import Register from './components/Register';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AutoBot from './components/AutoBot';
import SimulationBot from './components/SimulationBot';
import WalletConnect from './components/WalletConnect';
import Home from './components/Home';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isLoggedIn } = useAppContext();
  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

const AdminRoute = ({ component: Component, ...rest }) => {
  const { isAdminLoggedIn } = useAppContext();
  return (
    <Route
      {...rest}
      render={props =>
        isAdminLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to="/admin-login" />
        )
      }
    />
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/admin-login" component={AdminLogin} />
            <AdminRoute path="/admin-dashboard" component={AdminDashboard} />
            <PrivateRoute path="/auto-bot" component={AutoBot} />
            <PrivateRoute path="/simulation-bot" component={SimulationBot} />
            <PrivateRoute path="/wallet" component={WalletConnect} />
          </Switch>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
