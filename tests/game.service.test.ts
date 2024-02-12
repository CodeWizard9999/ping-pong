import { CustomError } from '../src/domain/custom-error';
import { GameService } from '../src/services/game';
import Game from '../src/domain/game.model';

describe('Game service', () => {
  afterAll(async () => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  it('should throw error in case of same players names', async () => {
    const gameService = new GameService();
    try {
      await gameService.play(['Bob', 'Bob']);
    } catch (error) {
      expect(error).toBeInstanceOf(CustomError);
      expect(error).toHaveProperty('message', 'Players should be with different names.');
    }
  });

  it('should win first player in case of 11-0 score', async () => {
    const gameService = new GameService();
    const mockPlayRound = jest.spyOn(GameService.prototype as any, 'playRound');

    mockPlayRound.mockImplementation(() => ({
      newFirstPlayerScore: 11,
      newSecondPlayerScore: 0
    }));

    jest.spyOn(Game, 'create').mockResolvedValueOnce(null);

    const result = await gameService.play(['Bob', 'Sam']);

    expect(result).toBe('Bob won');
  });

  it('should win second player in case of 0-11 score', async () => {
    const gameService = new GameService();
    const mockPlayRound = jest.spyOn(GameService.prototype as any, 'playRound');

    mockPlayRound.mockImplementation(() => ({
      newFirstPlayerScore: 0,
      newSecondPlayerScore: 11
    }));

    jest.spyOn(Game, 'create').mockResolvedValueOnce(null);

    const result = await gameService.play(['Bob', 'Sam']);

    expect(result).toBe('Sam won');
  });

  it('should be started ace in case of 10-10 score', async () => {
    const gameService = new GameService();
    const mockPlayRound = jest.spyOn(GameService.prototype as any, 'playRound');
    const mockPlayAce = jest.spyOn(GameService.prototype as any, 'playAce')
      .mockImplementation(() => ({
        firstPlayerAceScore: 4,
        secondPlayerAceScore: 6
      }));

    mockPlayRound.mockImplementation(() => ({
      newFirstPlayerScore: 10,
      newSecondPlayerScore: 10
    }));

    jest.spyOn(Game, 'create').mockResolvedValueOnce(null);

    await gameService.play(['Bob', 'Sam']);

    expect(mockPlayAce).toHaveBeenCalledTimes(1);
  });
});
