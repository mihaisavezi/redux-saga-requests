import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import { handleRequests } from 'redux-saga-requests';
import { createDriver } from 'redux-saga-requests-graphql';

export const configureStore = () => {
  const { requestsReducer, requestsSagas } = handleRequests({
    driver: createDriver({ url: 'http://localhost:3000/graphql' }),
  });

  const reducers = combineReducers({
    requests: requestsReducer,
  });

  const sagaMiddleware = createSagaMiddleware();
  const composeEnhancers =
    (typeof window !== 'undefined' &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

  const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(sagaMiddleware)),
  );

  function* rootSaga() {
    yield all(requestsSagas);
  }

  sagaMiddleware.run(rootSaga);
  return store;
};
