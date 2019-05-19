import React from 'react';
import { connect } from 'react-redux';
import { login, register, moduleName as authModule } from '@/store/ducks/auth';

class AuthPage extends React.Component {
  componentDidMount() {
    localStorage.removeItem('token');
  }
  render() {
    return <div />;
  }
}

export default connect(
  state => ({
    loading: state[authModule].loading,
    error: state[authModule].error
  }),
  { login, register }
)(AuthPage);
