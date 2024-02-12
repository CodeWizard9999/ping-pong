import { random } from 'lodash';
import Game from '../domain/game.model';
import { CustomError } from '../domain/custom-error';
import { toNumbersDifference } from '../utils';

export class GameService {
  public async play(players: string[]): Promise<string> {
    const firstPlayer = players[0];
    const secondPlayer = players[1];

    if (firstPlayer === secondPlayer) throw new CustomError(403, 'Players should be with different names.');

    const score = {
      firstPlayerScore: 0,
      secondPlayerScore: 0
    };
    const gameArray: string[] = [];

    while (
      (score.firstPlayerScore < 11 && score.secondPlayerScore !== 11)
        || (score.secondPlayerScore < 11 && score.firstPlayerScore !== 11)) {
      if (score.firstPlayerScore === 10 && score.secondPlayerScore === 10) {
        const aceScore = this.playAce(players);

        if (aceScore.firstPlayerAceScore < aceScore.secondPlayerAceScore) {
          gameArray.push(secondPlayer);
          score.firstPlayerScore += 1;
        } else if (aceScore.secondPlayerAceScore < aceScore.firstPlayerAceScore) {
          gameArray.push(firstPlayer);
          score.secondPlayerScore += 1;
        }
      } else {
        const { newFirstPlayerScore, newSecondPlayerScore, roundWinner } = this.playRound(
          players,
          score.firstPlayerScore,
          score.secondPlayerScore
        );

        score.firstPlayerScore = newFirstPlayerScore;
        score.secondPlayerScore = newSecondPlayerScore;

        gameArray.push(roundWinner);
      }
    }

    await Game.create(
      {
        player_1: firstPlayer,
        player_2: secondPlayer,
        player_1_score: score.firstPlayerScore,
        player_2_score: score.secondPlayerScore,
        rounds_story: gameArray
      }
    );

    return `${score.firstPlayerScore > score.secondPlayerScore ? players[0] : players[1]} won`;
  }

  private playAce(players: string[]): { firstPlayerAceScore: number, secondPlayerAceScore: number } {
    const aceScore = {
      firstPlayerAceScore: 0,
      secondPlayerAceScore: 0
    };

    while (toNumbersDifference(aceScore.firstPlayerAceScore, aceScore.secondPlayerAceScore) !== 2) {
      const { newFirstPlayerScore, newSecondPlayerScore } = this.playRound(
        players,
        aceScore.firstPlayerAceScore,
        aceScore.secondPlayerAceScore
      );

      aceScore.firstPlayerAceScore = newFirstPlayerScore;
      aceScore.secondPlayerAceScore = newSecondPlayerScore;
    }

    return aceScore;
  }

  private playRound(players: string[], firstPlayerScore: number, secondPlayerScore: number): {
    newFirstPlayerScore: number,
    newSecondPlayerScore: number,
    roundWinner: string
  } {
    const roundWinner = players[random(1)];
    const newScore = {
      newFirstPlayerScore: firstPlayerScore,
      newSecondPlayerScore: secondPlayerScore,
    };

    if (roundWinner === players[0]) {
      newScore.newFirstPlayerScore += 1;
    } else {
      newScore.newSecondPlayerScore += 1;
    }

    return { ...newScore, roundWinner };
  }
}
