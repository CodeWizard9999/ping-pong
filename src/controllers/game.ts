import { Router, NextFunction, Response, Request } from 'express';
import { GameService } from '../services/game';

export class GameController {
  private readonly router: Router;

  public constructor(private gameService: GameService) {
    this.router = Router();

    this.router.post('/add-game', this.addGame.bind(this));
  }

  public toRouter(): Router {
    return this.router;
  }

  public async addGame(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstPlayer, secondPlayer } = req.body;

      const result = await this.gameService.play([firstPlayer, secondPlayer]);

      return res.status(200).json({ result });
    } catch (err) {
      return next(err);
    }
  }
}
