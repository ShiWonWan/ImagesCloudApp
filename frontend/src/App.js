import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { useEffect } from 'react';
import './App.css';

import { Gallery } from './Components/Gallery'
import { Login, Register } from './Components/Login'
import { Index } from './Components/Index'

function App() {

  useEffect(() => document.title = "Cool Images App", [])

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path='/user+gallery' component={Gallery} />
          <Route path='/register' component={Register} />
          <Route path='/login' component={Login} />
          <Route path='/' component={Index} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;