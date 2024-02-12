import { GameController } from './controllers/game';
import { GameService } from './services/game';

export const gameService = new GameService();
export const gameController = new GameController(gameService);
