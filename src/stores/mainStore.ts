import { action, observable } from 'mobx';
import { keysToCamelCase } from '../helpers/objects';
import client, { addSubscriber } from '../helpers/client';
import storage from '../helpers/storage';
import { Word, Token } from '../types';

const tokenUrl = 'http://localhost:8000/api/token/';
const apiUrl = 'http://localhost:8000/api/words';
const familiarUrl = 'http://localhost:8000/api/words/familiar';

export default class MainStore {
  @observable words: Word[] = [];
  @observable token: Token | null = null;

  @action
  fetchToken() {
    let token = storage.get('token');
    if (token) {
      this.token = token;
    }

    addSubscriber((token: Token) => {
      this.token = token;
    });
  }

  @action
  async login(username: string, password: string) {
    const response = await client.post(tokenUrl, { username, password });

    let token = response.data;
    storage.save('token', token);

    this.token = token;
  }

  @action
  async fetchWords() {
    const response = await client.get(`${apiUrl}?format=json`, {
      headers: { Authorization: `Bearer ${this.token!.access}` }
    });
    const words = response.data.map(keysToCamelCase);
    this.words = words;
  }

  @action
  async knowWord(id: number) {
    try {
      await client.get(`${familiarUrl}/${id}`, {
        headers: { Authorization: `Bearer ${this.token!.access}` }
      });

      const wordIndex = this.words.findIndex(word => word.id === id);
      this.words[wordIndex].isFamiliar = true;
    } catch (e) {
      console.log(e);
    }
  }

  @action
  async deleteWord(id: number) {
    try {
      await client.delete(`${apiUrl}/${id}`, {
        headers: { Authorization: `Bearer ${this.token!.access}` }
      });
      this.words = this.words.filter(word => word.id !== id);
    } catch (e) {
      console.log(e);
    }
  }
}
