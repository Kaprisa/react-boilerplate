import * as R from 'ramda';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { axios } from 'redux-saga-wrapper/modules';
// import { actions } from 'redux-saga-wrapper/constants'

export const moduleName = 'auth';

export const ReducerRecord = {
  user: null,
  error: null,
  loading: false,
  activate: false,
  activation: null
};

import { sagaWrapper, sagaTrigger } from 'redux-saga-wrapper/helpers';

export const authSagaTrigger = sagaTrigger(moduleName);
export const authSagaWrapper = sagaWrapper(moduleName);

export const REGISTER_REQUEST = `${moduleName}/REGISTER_REQUEST`;
export const REGISTER_SUCCESS = `${moduleName}/REGISTER_SUCCESS`;
export const LOGIN_REQUEST = `${moduleName}/LOGIN_REQUEST`;
export const LOGIN_SUCCESS = `${moduleName}/LOGIN_SUCCESS`;
export const LOGOUT_REQUEST = `${moduleName}/LOGOUT_REQUEST`;
export const LOGOUT_SUCCESS = `${moduleName}/LOGOUT_SUCCESS`;
export const ERROR = `${moduleName}/ERROR`;

export default function reducer(state = R.clone(ReducerRecord), action) {
  const { type, payload } = action;
  switch (type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
      return R.merge(state, { loading: true, error: null });
    case REGISTER_SUCCESS:
      return R.merge(state, { loading: false, activate: true, error: null });
    case LOGIN_SUCCESS:
      return R.merge(state, { loading: false, error: null, user: payload });
    case ERROR:
      return R.merge(state, {
        loading: false,
        activate: false,
        error: payload
      });
    case LOGOUT_SUCCESS:
      return R.clone(ReducerRecord);
    default:
      return R.set(R.lensProp('error'), null, state);
  }
}

export function register(user) {
  return {
    type: REGISTER_REQUEST,
    payload: user
  };
}

export function login(user) {
  return {
    type: LOGIN_REQUEST,
    payload: user
  };
}

export function logout() {
  return {
    type: LOGOUT_REQUEST
  };
}

export const registerSaga = function*(payload) {
  yield call(axios.post, '/register', payload);
  yield put({
    type: REGISTER_SUCCESS
  });
};

export const loginSaga = function*(payload) {
  const {
    data: { user, auth_token }
  } = yield call(axios.post, '/login', payload);
  axios.defaults.headers.common['Authorization'] = auth_token;
  localStorage.clear();
  localStorage.setItem('token', auth_token);
  localStorage.setItem('user', user.id);
  localStorage.setItem(
    'ini',
    user.name
      ? user.name
          .split(/\s+/)
          .map(i => i[0])
          .join('')
      : '?'
  );
  yield put({
    type: LOGIN_SUCCESS,
    payload: user
  });
};

export const check = function*() {
  if (
    ['/login', '/auth', '/register', '/forgot', '/account_activations'].some(
      p => location.pathname.startsWith(p)
    )
  )
    return;
  axios.defaults.headers.common['Authorization'] = localStorage.getItem(
    'token'
  );
  try {
    // check
  } catch (error) {
    localStorage.clear();
    yield put(push('/auth'));
  }
};

export const logoutSaga = function*() {
  try {
    yield axios.post('/logout');
  } catch (_) {}
};

export const saga = function*() {
  yield all([
    check(),
    takeEvery(REGISTER_REQUEST, authSagaWrapper(registerSaga)),
    takeEvery(LOGIN_REQUEST, authSagaWrapper(loginSaga)),
    takeEvery(LOGOUT_REQUEST, authSagaWrapper(logoutSaga))
  ]);
};
