import services from './services';
import actions from './actions';
import localStorage from './localStorage';
import auth from './auth';
import routes from './routes';

function* fetchLogin(fields) {
  try {
    const response = yield call(services.fetchLogin, fields.data);
    yield put(actions.fetchLoginSuccess(response));
    localStorage.setItem('auth', JSON.stringify(response));
    auth.authenticate(() => fields.history.push(routes.overview.all));
  } catch (error) {
    yield put(actions.fetchLoginFailure(error));
  }
}