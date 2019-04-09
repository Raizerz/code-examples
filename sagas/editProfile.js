import services from './services';
import actions from './actions';

function* editProfile(profile) {
  try {
    const profileData = yield call(services.editProfile, profile);

    const {
      favoriteCurrencies,
      baseCurrency
    } = profileData.settings;
    const pairs = favoriteCurrencies.map(currency => `${baseCurrency}${currency}`);

    const currencyPairs = yield call(service.fetchCurrencyPairs, pairs);
    yield put(actions.fetchCurrencyPairsSuccess(currencyPairs));

    yield put(actions.editProfileSuccess(profileData));
  } catch (error) {
    yield put(actions.editProfileError(error));
  }
}