import { Server, Socket } from 'socket.io';
import { GameService } from 'src/game/game.service';

export class Game {
  static default_positionR = 50;
  static default_positionBx = 50;
  static default_positionBy = 50;
  static default_update = 60;
  static default_racklenght = 10;
  static default_rackwidth = 2;
  static default_steprack = 1;
  static default_radiusball = 1;
  static default_size_ball = 10;
  static default_sizeMinX = 0;
  static default_sizeMaxX = 100;
  static default_sizeMinY = 0;
  static default_sizeMaxY = 100;
  static default_victorygoal: 3;

  private _io: Server;
  private _loopid: NodeJS.Timeout;
  private _id: string;
  private _user1: Socket;
  private _user2: Socket;
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
  private _gameService: GameService;

  public constructor(
    id: string,
    user1: Socket,
    user2: Socket,
    io: Server,
    gameService: GameService,
  ) {
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
    this.start();
    this._loopid = setInterval(this.gameLoop, Game.default_update);
    this._io = io;
    this._gameService = gameService;
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

  public updateRacket(player: Socket, y: number) {
    if (player.id == this._user1.id) this._rack1y = y;
    else if (player.id == this._user2.id) this._rack2y = y;
  }

  public getGameInfo() {
    return {
      id: this._id,
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
  public async gameLoop() {
    this._ballx += this._dx;
    this._bally += this._dy;

    //check if ball will be in racket // TODO: check si ca marche
    if (
      this._ballx <
      this._minX + Game.default_rackwidth + Game.default_radiusball
    ) {
      if (
        this._bally > this._rack1y &&
        this._bally <= this._rack1y + Game.default_racklenght
      )
        this._rack1y -= Game.default_steprack;
    }
    if (
      this._ballx >
      this._maxX - Game.default_rackwidth - Game.default_radiusball
    ) {
      if (
        this._bally > this._rack2y &&
        this._bally <= this._rack2y + Game.default_racklenght
      )
        this._rack2y -= Game.default_steprack;
    }

    //calculate colision racket
    if (
      this._ballx <=
      this._minX + Game.default_rackwidth + Game.default_radiusball
    ) {
      if (
        this._bally >= this._rack1y &&
        this._bally <= this._rack1y + Game.default_racklenght
      )
        this._dx *= -1;
    }
    if (
      this._ballx >=
      this._maxX - Game.default_rackwidth - Game.default_radiusball
    ) {
      if (
        this._bally >= this._rack2y &&
        this._bally <= this._rack2y + Game.default_racklenght
      )
        this._dx *= -1;
    }

    //calculate colision wall
    if (this._ballx < this._minX || this._ballx > this._maxX) {
      if (this._ballx < this._minX) {
        this._score1++;
        this.start();
      }
      if (this._ballx > this._maxX) {
        this._score2++;
        this.start();
      }
    }
    if (this._bally < this._minY || this._bally > this._maxY) {
      this._dy *= -1;
    }

    if (this._score1 == Game.default_victorygoal) {
      this._user1.leave(this._id);
      this._user2.leave(this._id);
      this._user1.emit('finish_game', {
        score1: this._score1,
        score2: this._score2,
        status: 'win',
      });
      this._user2.emit('finish_game', {
        score1: this._score1,
        score2: this._score2,
        status: 'lose',
      });
      await this._gameService.finishGame(this._id, this._score1, this._score2);
      clearInterval(this._loopid);
      return;
    }
    if (this._score2 == Game.default_victorygoal) {
      this._user2.leave(this._id);
      this._user1.leave(this._id);
      this._user2.emit('finish_game', {
        score1: this._score1,
        score2: this._score2,
        status: 'win',
      });
      this._user1.emit('finish_game', {
        score1: this._score1,
        score2: this._score2,
        status: 'lose',
      });
      await this._gameService.finishGame(this._id, this._score1, this._score2);
      clearInterval(this._loopid);
      return;
    }
    this._io.to(this._id).emit('update_game', this.getGameInfo());
  }
}
