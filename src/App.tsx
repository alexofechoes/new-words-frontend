import React from 'react';
import { observer } from 'mobx-react';
import MainStore from './stores/mainStore';

import WordCardList from './components/WordCardList';
import SignInForm from './components/SignInForm';

function App(props: { store: MainStore }) {
  const { store } = props;
  store.fetchToken();

  const { token } = store;
  if (!token) {
    return <SignInForm handleLogin={props.store.login} />;
  }
  return <WordCardList store={store} />;
}

export default observer(App);
