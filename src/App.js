import React from "react";

import CardList from "./components/CardList";
import SignInForm from "./components/SignInForm";
import axios from "axios";
import storage from "./helpers/storage";

const tokenUrl = "http://localhost:8000/api/token/";
const refreshUrl = "http://localhost:8000/api/refresh/";

const client = axios.create({});
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorResponse = error.response
    if (isTokenExpiredError(errorResponse)) {
      return resetTokenAndReattemptRequest(error);
    }
    return Promise.reject(error)
  }
)
function isTokenExpiredError(errorResponse) {
  try {
    return errorResponse.data.code === "token_not_valid";
  } catch {
    return false;
  }
}

let isAlreadyFetchingAccessToken = false;

let subscribers = [];

async function resetTokenAndReattemptRequest(error) {
  try {
    const { response: errorResponse } = error;
    const token = storage.get('token'); 
    if (!token) {
      return Promise.reject(error);
    }
    
    const retryOriginalRequest = new Promise(resolve => {
      addSubscriber(token => {
        errorResponse.config.headers.Authorization = 'Bearer ' + token.access;
        console.log(errorResponse);
        const { method, url, headers } = errorResponse;
        resolve(axios({ method, url, headers }));
      });
    });

    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true;
      const response = await axios({
        method: 'post',
        url: refreshUrl,
        data: {
          refresh: token.refresh
        }
      });
      if (!response.data) {
        return Promise.reject(error);
      }
      const newAccess = response.data.access;
      token.access = newAccess;

      storage.save('token', token);
      isAlreadyFetchingAccessToken = false;
      onAccessTokenFetched(token);
    }
    return retryOriginalRequest;
  } catch (err) {
    return Promise.reject(err);
  }
}

function onAccessTokenFetched(accessToken) {
  subscribers.forEach(callback => callback(accessToken));
  subscribers = [];
}

function addSubscriber(callback) {
  subscribers.push(callback);
}

export default class App extends React.Component {
  state = {
    token: null
  };

  async componentDidMount() {
    let token = storage.get("token");
    addSubscriber((token) => this.setState({ ...this.state, token }));

    if (token) {
      this.setState({ ...this.state, token });
    }
  }

  handleLogin = async (username, password) => {
    const response = await client.post(tokenUrl, {
      username,
      password
    });

    let token = response.data;
    storage.save("token", token);

    this.setState({ ...this.state, token });
  };

  render() {
    const { token } = this.state;
    return token ? (
      <CardList client={client} token={token} />
    ) : (
      <SignInForm handleLogin={this.handleLogin} />
    );
  }
}
