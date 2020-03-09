import React from 'react';
import ReactDOM from 'react-dom';
// import { render } from '@testing-library/react';
import MainStore from './stores/mainStore';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const store = new MainStore();
  ReactDOM.render(<App store={store} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
