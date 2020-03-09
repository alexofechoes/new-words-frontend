import axios from 'axios';
import storage from './storage';
import { Token } from '../types';

// TODO refactoring this module

type AccessTokenSubscribeCallback = (accessToken: Token) => void;

const refreshUrl = 'http://localhost:8000/api/refresh/';

const client = axios.create({});
client.interceptors.response.use(
  response => response,
  error => {
    const errorResponse = error.response;
    if (isTokenExpiredError(errorResponse)) {
      return resetTokenAndReattemptRequest(error);
    }
    return Promise.reject(error);
  }
);

export default client;

function isTokenExpiredError(errorResponse: any) {
  try {
    return errorResponse.data.code === 'token_not_valid';
  } catch {
    return false;
  }
}

let isAlreadyFetchingAccessToken = false;

let subscribers: AccessTokenSubscribeCallback[] = [];

async function resetTokenAndReattemptRequest(error: any) {
  try {
    const { response: errorResponse } = error;
    const token = storage.get('token');
    if (!token) {
      return Promise.reject(error);
    }

    const retryOriginalRequest = new Promise(resolve => {
      addSubscriber((token: Token) => {
        errorResponse.config.headers.Authorization = 'Bearer ' + token.access;

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

function onAccessTokenFetched(accessToken: Token) {
  subscribers.forEach(callback => callback(accessToken));
  subscribers = [];
}

export function addSubscriber(callback: AccessTokenSubscribeCallback) {
  subscribers.push(callback);
}
