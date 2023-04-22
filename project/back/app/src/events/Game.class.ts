import {sleep} from "../utils/sleep";

export class Game {
  static default_positionR = 50;
  static default_positionBx = 50;
  static default_positionBy = 50;
  static default_update = 60;
  static default_size_racket = 10;
  private _id: string;
  private _user1: string;
  private _user2: string;
  private _rack1y: number;
  private _rack2y: number;
  private _score1: number;
  private _score2: number;
  private _ballx: number;
  private _bally: number;
  private _dx;
  private _dy;

  public constructor(id: string, user1: string, user2: string) {
    this._id = id;
    this._user1 = user1;
    this._user2 = user2;
    this._rack1y = Game.default_positionR;
    this._rack2y = Game.default_positionR;
    this._score1 = 0;
    this._score2 = 0;
    this._ballx = Game.default_positionBx;
    this._bally = Game.default_positionBy;
    this._dx = 0;
    this._dy = 0;
    const game = async () => {
      while (true) {
        await this.compute_game();
        await sleep(Game.default_update);
      }
    };
  }

  public getId() {
    return this._id;
  }

  public getUser1() {
    return this._user1;
  }

  public getUser2() {
    return this._user2;
  }

  public getRack1y() {
    return this._rack1y;
  }

  public getRack2y() {
    return this._rack2y;
  }

  public getScore1() {
    return this._score1;
  }

  public getScore2() {
    return this._score2;
  }

  public getBallx() {
    return this._ballx;
  }

  public getBally() {
    return this._bally;
  }

  public updateRacket(id: string, y: number) {
    if (id == this._user1) this._rack1y = y;
    else if (id == this._user2) this._rack2y = y;
  }

  public getGameInfo() {
    return {
      id: this._id,
      user1: this._user1,
      user2: this._user2,
      rack1y: this._rack1y,
      rack2y: this._rack2y,
      score1: this._score1,
      score2: this._score2,
      ballx: this._ballx,
      bally: this._bally,
    };
  }

  private compute_game() {
    if (this._dx == 0 || this._dy == 0) {
      this._dx = -this._dx;
    }
  }
}
