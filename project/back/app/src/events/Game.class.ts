import { Server, Socket } from 'socket.io';
import { GameService } from 'src/game/game.service';
import { sleep } from '../utils/sleep';

export class Game {
  static default_sizeMaxX = 100;
  static default_positionBx = this.default_sizeMaxX / 2;
  static default_sizeMaxY = 100;
  static default_positionBy = this.default_sizeMaxY / 2;
  static default_update = 60;
  static default_racklenght = 15;
  static default_positionR = 50 - (this.default_racklenght / 2);
  static default_rackwidth = 2;
  static default_steprack = 1;
  static default_radiusball = 1;
  static default_speedBall = 2;
  static default_sizeMinX = 0;
  static default_sizeMinY = 0;
  static default_victorygoal = 6;

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
  private _speedball : number;
  private _angle;
  private _minX;
  private _maxX;
  private _minY;
  private _maxY;
  private _futurballx;
  private _futurbally;
  private _gameService: GameService;
  private _finishCallback: Array<() => void> = [];

  public constructor(
    id: string,
    user1: Socket,
    user2: Socket,
    io: Server,
    gameService: GameService,
    finishCallback = [],
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
    this._speedball = Game.default_speedBall;
    this._minX = Game.default_sizeMinX;
    this._maxX = Game.default_sizeMaxX;
    this._minY = Game.default_sizeMinY;
    this._maxY = Game.default_sizeMaxY;
    this._futurballx = this._ballx;
    this._futurbally = this._bally;
    this._io = io;
    this._angle = 180;
    this._gameService = gameService;
    console.log('game created' + this._id);
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
    if (player.id == this._user1.id) {
      if (y == 1) {
        if (this._rack1y >= this._maxY - Game.default_racklenght)
          this._rack1y = this._maxY - Game.default_racklenght;
        else
          this._rack1y += 2;
      } else if (y == 0) {
        if (this._rack1y - 2 <= 0)
          this._rack1y = 0 ;
        else
          this._rack1y -= 2;
      }
    } else if (player.id == this._user2.id) {
      if (y == 1) {
        if (this._rack2y >= this._maxY - Game.default_racklenght)
          this._rack2y = this._maxY - Game.default_racklenght;
        else
          this._rack2y += 2;
      } else if (y == 0) {
        if (this._rack2y <= 0)
          this._rack2y = 0;
        else
          this._rack2y -= 2;
      }
    }
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
  public async start() {
    console.log('game launch ' + this._id);
    await sleep(3000);
    while (((Math.cos(this._angle)) < 0.5 && (Math.cos(this._angle)  > -0.5)) && this._angle != 0 && this._angle != 180) {
      this._angle = Math.random() * 360;
      console.log(this._angle);
      console.log(Math.random());
    }
    this._loopid = setInterval(this.gameLoop, Game.default_update);
  }

  private endWar = async (userWin:Socket, userDefeat:Socket) => {
    console.log('game finish ' + this._id);
    this._user1.leave(this._id);
    this._user2.leave(this._id);
    userWin.emit('finish_game', {
      score1: this._score1,
      score2: this._score2,
      status: 'win',
    });
    userDefeat.emit('finish_game', {
      score1: this._score1,
      score2: this._score2,
      status: 'lose',
    });
    await this._gameService.finishGame(this._id, this._score1, this._score2);
    clearInterval(this._loopid);
    this.executeFinishCallbacks();
  }

  private endBattle = async (scoreWin:number) :Promise<number> => {
    scoreWin++;
    if (scoreWin != Game.default_victorygoal) {
      this._rack1y = Game.default_positionR;
      this._rack2y = Game.default_positionR;
      this._ballx = Game.default_positionBx;
      this._bally = Game.default_positionBy;
      this._futurballx = this._ballx;
      this._futurbally = this._bally;
      this._speedball = Game.default_speedBall;
      this._io.to(this._id).emit('update_game', this.getGameInfo());
      clearInterval(this._loopid);
      this.start();
    }
        return scoreWin;
  }


  public gameLoop = async () => {
    this._futurballx = this._ballx + Math.sin(this._angle) * this._speedball;
    this._futurbally = this._bally + Math.cos(this._angle) * this._speedball;
    let minposition = this._minY + Game.default_rackwidth + Game.default_radiusball;
    let maxposition = ((this._maxY - Game.default_rackwidth) - Game.default_radiusball)
    
    if (
      this._bally <= minposition
      ) {
        console.log(this._angle);
        if (
          this._futurballx >= this._rack1y &&
          this._futurballx <= this._rack1y + Game.default_racklenght
          ) {
            //this._speedball += 1;
            this._angle = Math.PI - this._angle;
            let distbar = this._futurbally - minposition;
            this._futurbally -= 2 * distbar;
            if (this._futurballx < (this._rack2y + (Game.default_racklenght / 3)) && this._angle > 100)
            this._angle += 10;
            if (this._futurballx > (this._rack2y + ( 2 * (Game.default_racklenght / 3))) && this._angle < 170)
            this._angle -= 10;
          }
          else {
              this.endBattle(this._score1)
              .then((resolvedScore: number) => {
                this._score1 = resolvedScore;
                if (this._score1 >= Game.default_victorygoal)
                this.endWar(this._user1, this._user2);
              })
            }
            console.log(this._angle);
          }
          
          if (
            this._futurbally >= maxposition
            
            ) {
              console.log(this._angle);
              if (
                this._futurballx >= this._rack2y &&
                this._futurballx <= (this._rack2y + Game.default_racklenght)
                ) {
                  //this._speedball += 1;
                  this._angle = Math.PI - this._angle;
                  let distbar = this._futurbally - maxposition;
                  this._futurbally -= 2 * distbar;

                  if (this._futurballx < (this._rack1y + (Game.default_racklenght / 3)) && this._angle < 80)
                    this._angle -= 10;
                  if (this._futurballx > (this._rack1y + ( 2 * (Game.default_racklenght / 3))) && this._angle > 280)
                    this._angle += 10;
        }
        else {
          this.endBattle(this._score1)
          .then((resolvedScore: number) => {
            this._score2 = resolvedScore;
            if (this._score2 >= Game.default_victorygoal)
            this.endWar(this._user2, this._user1);
          })
        }
        console.log(this._angle);
      }

      if (this._futurballx < this._minX + Game.default_radiusball || this._futurballx > this._maxX - Game.default_radiusball) {
        if (this._futurballx < this._minX + Game.default_radiusball) {
          let distbar = this._futurballx - (this._minX + Game.default_radiusball);
          this._futurballx -= 2 * distbar;
        }
        else {
          let distbar = this._futurballx - (this._maxX + Game.default_radiusball);
          this._futurballx -= 2 * distbar;
        }
        this._angle = - this._angle;
      }
      this._ballx = this._futurballx;
      this._bally = this._futurbally;

      this._io.to(this._id).emit('update_game', this.getGameInfo());
    };
    
    private executeFinishCallbacks() {
    console.log('Callbacks:', this._finishCallback);
    this._finishCallback.forEach((callback) => callback());
  }
  onFinish(callback) {
    this._finishCallback.push(callback);
  }
  
  public remake() {
    console.log('game finish ' + this._id);
    this._io.to(this._id).emit('finish_game', {
      score1: 0,
      score2: 0,
      status: 'remake',
    });
    this._user2.leave(this._id);
    this._user1.leave(this._id);
    clearInterval(this._loopid);
    this.executeFinishCallbacks();
  }
}
