import { useState } from 'react'
import { Sudoku, generator } from '@forfuns/sudoku'

import './App.css'

import karlach from './assets/karlach.png'
import astarion from './assets/astarion.png'
import wyll from './assets/wyll.png'
import shadowheart from './assets/shadowheart.png'
import laezel from './assets/laezel.png'
import gale from './assets/gale.png'
import gortash from './assets/gortash.png'
import halsin from './assets/halsin.png'
import minthara from './assets/minthara.png'

enum GameStates {
  Loading,
  Playing,
  Complete
}
type SudokuPuzzle = number[]

const WIDTH = 9
const DIFFICULTY = 0

function App () {
  const [gameState, setGameState] = useState<GameStates>(GameStates.Playing)
  const [selectedNumber, setSelectedNumber] = useState<number>(-1)

  const firstPuzzle = generator(DIFFICULTY)
  const [puzzle, setPuzzle] = useState<SudokuPuzzle>(firstPuzzle)
  const sudoku = new Sudoku(puzzle, true)

  const [currentBoard, setCurrentBoard] = useState<SudokuPuzzle>(puzzle)

  const solution = sudoku.getSolution()

  const elementAsAvatar = (element: number): React.ReactNode => {
    let avatarPath = null
    switch (element) {
      case 1:
        avatarPath = karlach
        break
      case 2:
        avatarPath = astarion
        break
      case 3:
        avatarPath = wyll
        break
      case 4:
        avatarPath = shadowheart
        break
      case 5:
        avatarPath = gale
        break
      case 6:
        avatarPath = gortash
        break
      case 7:
        avatarPath = halsin
        break
      case 8:
        avatarPath = minthara
        break
      case 9:
        avatarPath = laezel
        break
      default:
        break
    }

    return avatarPath ? <img src={avatarPath} alt={`Number ${element}`} /> : null
  }

  const puzzleCellClasses = (i: number): string => {
    // console.log('puzzleCellClasses', i, puzzle[i], puzzle[i] > 0 ? 'fixed-space' : '')
    return puzzle[i] > 0 ? 'fixed-space' : ''
  }

  const onClickReset = (): void => {
    const newPuzzle = generator(DIFFICULTY)
    setPuzzle(newPuzzle)
    setCurrentBoard(newPuzzle)
  }

  const onClickSpace = (selectedIndex: number, currentElement: number): void => {
    // don't change the value if we're not playing an active game
    if (gameState !== GameStates.Playing) {
      return
    }
    // don't change the value if this value is set in the puzzle
    if (puzzle[selectedIndex] > 0) {
      return
    }
    // don't change the value if we don't have a selected number to change it to
    if (selectedNumber < 0) {
      return
    }

    const newBoard = currentBoard.map((el) => el)
    if (newBoard[selectedIndex] === selectedNumber) {
      newBoard[selectedIndex] = -1
    } else {
      newBoard[selectedIndex] = selectedNumber
    }
    setCurrentBoard(newBoard)

    // this is where the magic happens
    // if the current board is the same as the solution
    // we're done!
    if (solution.join('') === currentBoard.join('')) {
      setGameState(GameStates.Complete)
    }
  }

  const onClickNumberSelector = (n: number): void => {
    if (n !== selectedNumber) {
      setSelectedNumber(n)
    } else {
      setSelectedNumber(-1)
    }
  }

  const onClickSubmit = () => {
    // this is where the magic happens
    // if the current board is the same as the solution
    // we're done!
    if (solution.join('') === currentBoard.join('')) {
      setGameState(GameStates.Complete)
    }
  }

  return (
    <>
      <h1>Sudoku But Make It BG3</h1>
      <div className="card">
        <button onClick={onClickSubmit}>
          Check Solution
        </button>
        <button onClick={onClickReset}>
          New Puzzle
        </button>
        <table className="number-selector">
          <tbody>
            <tr>
              {[...Array(9)].map((_, i) => <td key={`number-selector-cell-${i}`} className={selectedNumber === i + 1 ? 'selected' : ''} onClick={() => { onClickNumberSelector(i + 1) }}>{elementAsAvatar(i + 1)}</td>)}
            </tr>
          </tbody>
        </table>
        <p>
          Game state is {gameState} and have won test is {solution.join('') === currentBoard.join('') ? "true" : "false"}
        </p>
        <p>
          Puzzle is <code>{puzzle}</code>
        </p>

        <p>
          Current board is <code>{currentBoard}</code>
        </p>
        <p>
          Solution is is <code>{solution}</code>
        </p>
      {gameState === GameStates.Complete ? <p>You Won!</p> : null }

       {gameState === GameStates.Playing
         ? <table className="sudoku-board">
          <tbody>
            {currentBoard.map((_, i) =>
              i % WIDTH === 0
                ? <tr key={`row${i}`}>{currentBoard.slice(i, i + WIDTH).map((el, j) =>
                <td key={`cell${i + j}`} className={puzzleCellClasses(i + j)} onClick={() => { onClickSpace(j + i, el) }}>{elementAsAvatar(el)}</td>
                )}</tr>
                : null
            )}
          </tbody>
        </table>
         : null}
      </div>
    </>
  )
}

export default App
