import React, { useEffect, useState } from "react";
import { Sudoku, generator as sudokuGenerator } from "@forfuns/sudoku";

import "./App.css";

// import karlach from "./assets/karlach.png";
// import astarion from "./assets/astarion.png";
// import wyll from "./assets/wyll.png";
// import shadowheart from "./assets/shadowheart.png";
// import laezel from "./assets/laezel.png";
// import gale from "./assets/gale.png";
// import gortash from "./assets/gortash.png";
// import halsin from "./assets/halsin.png";
// import minthara from "./assets/minthara.png";

import karlachThumb from "./assets/karlach-thumb.png";
import astarionThumb from "./assets/astarion-thumb.png";
import wyllThumb from "./assets/wyll-thumb.png";
import shadowheartThumb from "./assets/shadowheart-thumb.png";
import laezelThumb from "./assets/laezel-thumb.png";
import galeThumb from "./assets/gale-thumb.png";
import gortashThumb from "./assets/gortash-thumb.png";
import halsinThumb from "./assets/halsin-thumb.png";
import mintharaThumb from "./assets/minthara-thumb.png";

// const fruits = ["Apple", "Orange", "Pear"] as const;
// type Fruit = typeof fruits[number]; // "Apple" | "Orange" | "Pear"
const gameStates = ["Loading", "Playing", "Complete", "Error"] as const;
type GameState = (typeof gameStates)[number];
const difficultyLevels = ["Explorer", "Normal", "Tactician"] as const;
type DifficultyLevel = (typeof difficultyLevels)[number];
type SudokuPuzzle = number[];

// the arbitrary mapping of bg3 characters to numbers between 1-9
// that is at the heart of this smudge of software
// or not
// const megaMap = {
//   1: 'karlach',
//   2: 'astarion',
//   3: 'wyll',
//   4: 'shadowheart',
//   5: 'gale',
//   6: 'gortash',
//   7: 'halsin',
//   8: 'minthara',
//   9: 'laezel'
// }

// sudoku boards are 9x9
const WIDTH = 9;
// this value for empty squares comes from @forfuns/sudoku
const UNSET_VALUE = -1;
// an array of width^2 length, all values are -1 representing empty squares
const EMPTY_BOARD = [...Array(WIDTH * WIDTH)].map(() => UNSET_VALUE);
// a board that is all astarion
const ROOM_AND_IM_THE_BOARD = [...Array(WIDTH * WIDTH)].map(() => UNSET_VALUE);

const makePuzzleAndSolutionAsync = async (
  level: DifficultyLevel,
): Promise<[SudokuPuzzle, SudokuPuzzle] | undefined> => {
  try {
    const generatedPuzzle = sudokuGenerator(difficultyLevels.indexOf(level));
    const sudoku = new Sudoku(generatedPuzzle, true);
    const generatedSolution = sudoku.getSolution();
    return [generatedPuzzle, generatedSolution];
  } catch (e) {
    console.log("error thrown by makePuzzleAndSolutionAsync", e);
  }
};

function App(): React.ReactNode {
  const [gameState, setGameState] = useState<GameState>("Loading");
  const [selectedNumber, setSelectedNumber] = useState<number>(UNSET_VALUE);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyLevel>("Explorer");

  const [puzzle, setPuzzle] = useState<SudokuPuzzle>(EMPTY_BOARD);
  const [puzzleSolution, setPuzzleSolution] = useState<SudokuPuzzle>(
    ROOM_AND_IM_THE_BOARD,
  );

  const [currentBoard, setCurrentBoard] = useState<SudokuPuzzle>(puzzle);

  useEffect(() => {
    async function getPuzzle(): Promise<void> {
      const puzzleAndSolution =
        await makePuzzleAndSolutionAsync(selectedDifficulty);
      if (
        puzzleAndSolution !== undefined && puzzle?.length > 1
      ) {
        setCurrentBoard(puzzleAndSolution[0]);
        setPuzzle(puzzleAndSolution[0]);
        setPuzzleSolution(puzzleAndSolution[1]);
        setGameState("Playing");
      }
    }
    getPuzzle().catch((e) => {
      console.log("error trying to generate puzzle", e);
    });
  }, []);

  const digitToAvatar = (
    element: number,
  ): React.ReactNode => {
    // in every program that actually does anything you write an ugly switch statement
    let avatarPath = null;
    switch (element) {
      case 1:
        avatarPath = karlachThumb;
        break;
      case 2:
        avatarPath = astarionThumb;
        break;
      case 3:
        avatarPath = wyllThumb;
        break;
      case 4:
        avatarPath = shadowheartThumb;
        break;
      case 5:
        avatarPath = galeThumb;
        break;
      case 6:
        avatarPath = gortashThumb;
        break;
      case 7:
        avatarPath = halsinThumb;
        break;
      case 8:
        avatarPath = mintharaThumb;
        break;
      case 9:
        avatarPath = laezelThumb;
        break;
      default:
        break;
    }

    if (avatarPath !== null && avatarPath.length > 0) {
      return <img src={avatarPath} alt={`Number ${element}`} />;
    }
    return null;
  };

  const puzzleCellClasses = (i: number): string => {
    // for styling purposes, if the game has been won
    if (gameState === "Complete" || gameState === "Loading") {
      return "fixed-space";
    }
    return puzzle[i] > 0 ? "fixed-space" : "";
  };

  const onClickReset = (): void => {
    const newPuzzle = sudokuGenerator(
      difficultyLevels.indexOf(selectedDifficulty),
    );
    const sudoku = new Sudoku(newPuzzle);
    setPuzzle(newPuzzle);
    setCurrentBoard(newPuzzle);
    setPuzzleSolution(sudoku.getSolution());
  };

  const onClickSpace = (selectedIndex: number): void => {
    // don't change the value if we're not playing an active game
    if (gameState !== "Playing") {
      return;
    }
    // don't change the value if this value is set in the puzzle
    if (puzzle[selectedIndex] > 0) {
      return;
    }
    // don't change the value if we don't have a selected number to change it to
    if (selectedNumber < 0) {
      return;
    }

    // okay we're actually doing this thing!
    // this, for our sins, is javascript so we need to create a new array
    // either set the clicked square as the selected number
    // or if it's already set as the selected number, unset it
    const newBoard = currentBoard.map((el) => el);
    if (newBoard[selectedIndex] === selectedNumber) {
      newBoard[selectedIndex] = UNSET_VALUE;
    } else {
      newBoard[selectedIndex] = selectedNumber;
    }

    setCurrentBoard(newBoard);
    // if the current board is the same as the solution
    // the game is won!
    if (puzzleSolution.join("") === newBoard.join("")) {
      setGameState("Complete");
    }
  };

  const onClickNumberSelector = (n: number): void => {
    // the "number selector" is a list of all the characters
    // clicking on one selects the character/number as the one that fills empty squares
    // unless that one is already the 'selected number', in which case it's unset
    if (n !== selectedNumber) {
      setSelectedNumber(n);
    } else {
      setSelectedNumber(UNSET_VALUE);
    }
  };

  const onSelectDifficulty = (
    evt: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { value } = evt.target;
    console.log({ value });
    setSelectedDifficulty(value as DifficultyLevel)
  };

  return (
    <>
      <h2>
        The bloodthirsty dopplegangers who live in the sewers are attacking!
        You&apos;d better…
      </h2>
      <h1>Gather Your Party</h1>
      <div className="card">
        <div>
          <h3>Choose Your Fighter</h3>
          <table className="number-selector">
            <tbody>
              <tr>
                {[...Array(9)]
                  .map((_, i) => (
                    <td
                      key={`number-selector-cell-${i + 1}`}
                      className={selectedNumber === i + 1 ? "selected" : ""}
                      onClick={() => {
                        onClickNumberSelector(i + 1);
                      }}
                    >
                      {digitToAvatar(i + 1)}
                    </td>
                  ))}
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Keep the same face out of the same party (3x3 square or vertical or
          horizontal line). You&apos;ll know when you&apos;ve won!{" "}
        </p>
        <table className="sudoku-board">
          <tbody>
            {currentBoard.map((_, i) =>
              i % WIDTH === 0 ? (
                <tr key={`row${i}`}>
                  {currentBoard.slice(i, i + WIDTH).map((el, j) => (
                    <td
                      key={`cell${i + j}`}
                      className={puzzleCellClasses(i + j)}
                      onClick={() => {
                        onClickSpace(j + i);
                      }}
                    >
                      {digitToAvatar(el)}
                    </td>
                  ))}
                </tr>
              ) : null,
            )}
          </tbody>
        </table>
        {
          <p style={gameState !== "Complete" ? { visibility: "hidden" } : {}}>
            You Won!
          </p>
        }
        <div className="controls">
          <fieldset>
            <legend>Select a difficulty level</legend>
            <div className="difficulties">
              {difficultyLevels.map((level) => (
                <div key={level}>
                  <input
                    type="radio"
                    onChange={onSelectDifficulty}
                    id={level}
                    name="difficultyLevel"
                    value={level}
                    checked={level === selectedDifficulty}
                  />
                  <label htmlFor={level}>{level}</label>
                </div>
              ))}
            </div>
          </fieldset>
      </div>
        <div className="control-buttons">
          <button onClick={onClickReset}>New Puzzle</button>
        </div>
      </div>
      <div className="footer">
        <p>
          <a href="https://github.com/sarahmeyer/bg3-sudoku">src for this game.</a> thank you to forfuns for their <a href="https://github.com/einsitang/sudoku-nodejs">sudoku package</a> and larian for bg3
        </p>
      </div>
    </>
  );
}

export default App;
