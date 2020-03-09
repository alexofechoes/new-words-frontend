import React from 'react';
import { observer } from 'mobx-react';

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import WordCard from './WordCard';
import MainStore from '../stores/mainStore';

@observer
class WordCardList extends React.Component<{ store: MainStore }, {}> {
  async componentDidMount() {
    const { store } = this.props;
    store.fetchWords();
  }

  knowHandle = (id: number) => async () => {
    const { store } = this.props;
    store.knowWord(id);
  };

  deleteHandle = (id: number) => async () => {
    const { store } = this.props;
    store.deleteWord(id);
  };

  render() {
    const { words } = this.props.store;
    const notFamiliarWords = words.filter(word => !word.isFamiliar);

    return (
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="sm" style={{ backgroundColor: '#cfe8fc' }}>
          <Typography component="div" style={{ height: '2rem' }} />
          {notFamiliarWords.map(word => (
            <WordCard
              key={word.id}
              word={word}
              knowHandle={this.knowHandle(word.id)}
              deleteHandle={this.deleteHandle(word.id)}
            ></WordCard>
          ))}
          <Typography component="div" style={{ height: '1rem' }} />
        </Container>
      </React.Fragment>
    );
  }
}

export default WordCardList;
