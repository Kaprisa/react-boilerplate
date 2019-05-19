import React from 'react';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import store from './store';
import App from '@/components/App';
import AuthPage from '@/pages/Auth/Page';

class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/auth" component={AuthPage} />
            <Route path="*" component={App} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default hot(module)(Root);
