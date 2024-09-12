import { Boardgame } from './boardgame.model';

export interface User {
  username: string;
  photo_url: string;
  _id: string;
  friends?: string[];
  boardgames?: Boardgame[];
}
