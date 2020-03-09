import React from 'react';
import { observer } from 'mobx-react';
import MainStore from './stores/mainStore';

import WordCardList from './components/WordCardList';
import SignInForm from './components/SignInForm';

@observer
export default class App extends React.Component<{ store: MainStore }, {}> {
  componentDidMount() {
    const { store } = this.props;
    store.fetchToken();
  }

  render() {
    const { store } = this.props;
    const { token } = store;

    if (!token) {
      return <SignInForm handleLogin={this.props.store.login} />;
    }
    return <WordCardList store={store} />;
  }
}
