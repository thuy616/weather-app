import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { client } from './reducers';

export default function (initialState) {
	const middlewares = [thunk, client.middleware()]
	const finalCreateStore = compose(
		applyMiddleware(...middlewares),
		typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
	)(createStore);

	const store = finalCreateStore(rootReducer, initialState);

	if (module.hot) {
	    // Enable Webpack hot module replacement for reducers
	    module.hot.accept('./reducers', () => {
	      	const nextRootReducer = require('./reducers/index').default;
	      	store.replaceReducer(nextRootReducer);
	    });
	}

	return store;
}
