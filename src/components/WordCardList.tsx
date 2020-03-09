import React from 'react';
import { observer } from 'mobx-react';

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import WordCard from './WordCard';
import MainStore from '../stores/mainStore';

function WordCardList(props: { store: MainStore }) {
  const { store } = props;
  store.fetchWords();

  const { words } = props.store;
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
            knowHandle={() => store.knowWord(word.id)}
            deleteHandle={() => store.deleteWord(word.id)}
          ></WordCard>
        ))}
        <Typography component="div" style={{ height: '1rem' }} />
      </Container>
    </React.Fragment>
  );
}

export default observer(WordCardList);
