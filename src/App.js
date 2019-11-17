import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Card from "./components/Card";
import axios from "axios";
import { keysToCamelCase } from "./helpers/objects";
import produce from "immer";

const apiUrl = "http://127.0.0.1:8000/api/words";
const familiarUrl = "http://127.0.0.1:8000/api/words/familiar/";

export default class App extends React.Component {
  state = {
    cards: []
  };

  async componentDidMount() {
    const response = await axios.get(`${apiUrl}?format=json`);
    const cards = response.data.map(keysToCamelCase);

    this.setState({ ...this.state, cards });
  }

  knowHandle = id => async () => {
    const { cards } = this.state;

    try {
      await axios.get(familiarUrl + id);

      const cardIndex = cards.findIndex(card => card.id === id);
      const updateState = produce(this.state, draftState => {
        draftState.cards[cardIndex].isFamiliar = true;
      });
      this.setState({ ...updateState });
    } catch (e) {
      console.log(e);
    }
  };

  deleteHandle = id => async () => {
    const { cards } = this.state;

    try {
      await axios.delete(`${apiUrl}/${id}`);
      const filteredCards = cards.filter(card => card.id !== id); 
      
      this.setState({ ...this.state, cards: filteredCards });
    } catch (e) {
      console.log(e);
    }
  };

  renderCards() {
    const { cards } = this.state;
    return cards
      .filter(card => !card.isFamiliar)
      .map(card => (
        <Card
          key={card.id}
          card={card}
          knowHandle={this.knowHandle(card.id)}
          deleteHandle={this.deleteHandle(card.id)}
        ></Card>
      ));
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="sm" style={{ backgroundColor: "#cfe8fc" }}>
          <Typography component="div" style={{ height: "2rem" }} />
          {this.renderCards()}
          <Typography component="div" style={{ height: "1rem" }} />
        </Container>
      </React.Fragment>
    );
  }
}
