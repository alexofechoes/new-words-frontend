import React from "react";

import CardList from "./components/CardList";
import SignInForm from "./components/SignInForm";
import axios from "axios";
import storage from "./helpers/storage";

const tokenUrl = "http://localhost:8000/api/token/";

export default class App extends React.Component {
  state = {
    token: null
  };

  async componentDidMount() {
    let token = storage.get("token");

    if (token) {
      this.setState({ ...this.state, token });
    }
  }

  handleLogin = async (username, password) => {
    const response = await axios.post(tokenUrl, {
      username,
      password
    });

    let token = response.data;
    storage.save("token", token);
    console.log(token);

    this.setState({ ...this.state, token });
  };

  render() {
    const { token } = this.state;
    return token ? (
      <CardList token={token} />
    ) : (
      <SignInForm handleLogin={this.handleLogin} />
    );
  }
}
