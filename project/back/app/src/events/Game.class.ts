import { Server } from 'socket.io';

export class Game {
  static default_positionR = 50;
  static default_positionBx = 50;
  static default_positionBy = 50;
  static default_update = 60;
  static default_size_racket = 10;
  static default_size_ball = 10;
  static default_sizeMinX = 0;
  static default_sizeMaxX = 100;
  static default_sizeMinY = 0;
  static default_sizeMaxY = 100;

  private _io: Server;
  private _loopid: NodeJS.Timeout;
  private _id: string;
  private _user1: string;
  private _user2: string;
  private _racklenght: number;
  private _rackhalflenght: number;
  private _rackwidth: number;
  private _rack1y: number;
  private _rack2y: number;
  private _score1: number;
  private _score2: number;
  private _ballx: number;
  private _bally: number;
  private _dx;
  private _dy;
  private _minX;
  private _maxX;
  private _minY;
  private _maxY;
  private _victorygoal: number

  public constructor(id: string, user1: string, user2: string, io: Server) {
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
    this._minX = 0;
    this._maxX = 0;
    this._minY = 0;
    this._maxY = 0;
    this._racklenght = 10;
    this._rackhalflenght = this._racklenght/2;
    this._rackwidth = 2;
    this._victorygoal = 3;
    this.start();
    this._loopid = setInterval(this.gameLoop, Game.default_update);
    this._io = io;
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
  public start() {
    const angle = Math.random() * 360;
    this._rack1y = Game.default_positionR;
    this._rack2y = Game.default_positionR;
    this._ballx = 0;
    this._bally = 0;
    this._dx = Math.cos(angle);
    this._dy = Math.sin(angle);
  }
  public gameLoop() {
    this._ballx += this._dx;
    this._bally += this._dy;
    //calculate colision racket // // 2% pas pris en compte
    if (this._ballx = this._minX + this._rackwidth)
    {
      if(this._bally <= this._rack1y + this._rackhalflenght && this._bally >= this._rack1y - this._rackhalflenght)
        this._dx *= -1;
    }
    if (this._ballx = this._maxX - this._rackwidth)
    {
      if(this._bally <= this._rack2y + this._rackhalflenght && this._bally >= this._rack2y - this._rackhalflenght)
        this._dx *= -1;
    }

    //calculate colision wall
    if (this._ballx < this._minX || this._ballx > this._maxX) {
      if(this._ballx < this._minX)
      {
        this._score1++;
        this.start();
      }
        if(this._ballx > this._maxX)
        {
          this._score2++;
          this.start();
        }
    }
    if (this._bally < this._minY || this._bally > this._maxY) {
      this._dy *= -1;
    }

    if (this._score1 == this._victorygoal)
    {
      this._io.to(this._id).emit('player1won', this.getGameInfo());
      clearInterval(this._loopid);
      return ;
    }
    if (this._score2 == this._victorygoal)
    {
      this._io.to(this._id).emit('player2won', this.getGameInfo());
      clearInterval(this._loopid);
      return ;
    }
    // TODO stoquer les gagnant dans la db
    this._io.to(this._id).emit('update_game', this.getGameInfo());
  }
}
