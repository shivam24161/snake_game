import React, { useState, useEffect } from "react";
import "./SnakeGame.css";
const numRows = window.innerWidth <= 768 ? 16 : 20;
const numCols = window.innerWidth <= 768 ? 16 : 20;
const Direction = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
};
const getRandomCoord = () => {
  return {
    x: Math.floor(Math.random() * numCols),
    y: Math.floor(Math.random() * numRows),
  };
};
const initialSnake = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const initialDirection = Direction.RIGHT;

const SnakeGame = () => {
  const [snake, setSnake] = useState(initialSnake);
  const [levelTime, setLevelTime] = useState(150);
  const [direction, setDirection] = useState(initialDirection);
  const [food, setFood] = useState(getRandomCoord());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState({
    intialStart: true,
    gameEnd: true,
  });
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!gameOver.gameEnd) {
        switch (event.key) {
          case "ArrowUp":
            if (direction !== Direction.DOWN) setDirection(Direction.UP);
            break;
          case "ArrowDown":
            if (direction !== Direction.UP) setDirection(Direction.DOWN);
            break;
          case "ArrowLeft":
            if (direction !== Direction.RIGHT) setDirection(Direction.LEFT);
            break;
          case "ArrowRight":
            if (direction !== Direction.LEFT) setDirection(Direction.RIGHT);
            break;
          case "Escape":
            setPaused(!paused);
            break;
          default:
            break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [direction, gameOver, paused]);

  useEffect(() => {
    const moveSnake = setInterval(() => {
      if (!gameOver.gameEnd && !paused) {
        const newSnake = [...snake];
        let head = { ...newSnake[0] };
        switch (direction) {
          case Direction.UP:
            head.y--;
            break;
          case Direction.DOWN:
            head.y++;
            break;
          case Direction.LEFT:
            head.x--;
            break;
          case Direction.RIGHT:
            head.x++;
            break;
          default:
            break;
        }
        newSnake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
          setFood(getRandomCoord());
          setScore((score) => {
            if (levelTime === 50) {
              return score + 20;
            } else if (levelTime === 100) {
              return score + 10;
            } else {
              return score + 5;
            }
          });
        } else {
          newSnake.pop();
        }
        if (
          head.x < 0 ||
          head.x >= numCols ||
          head.y < 0 ||
          head.y >= numRows ||
          newSnake
            .slice(1)
            .some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
          setGameOver({
            intialStart: false,
            gameEnd: true,
          });
          clearInterval(moveSnake);
        }
        setSnake(newSnake);
      }
    }, levelTime);

    return () => {
      clearInterval(moveSnake);
    };
  }, [snake, direction, food, gameOver, score, paused, levelTime]);

  const restartGame = () => {
    setSnake(initialSnake);
    setDirection(initialDirection);
    setFood(getRandomCoord());
    setScore(0);
    setGameOver({
      intialStart: false,
      gameEnd: false,
    });
    setPaused(false);
  };
  const handlePause = () => {
    setPaused(!paused);
  };
  const handleLevelTime = (e) => {
    const lev = e.target.value;
    switch (lev) {
      case "medium":
        setLevelTime(100);
        break;
      case "hard":
        setLevelTime(50);
        break;
      default:
        setLevelTime(150);
        break;
    }
  };
  return (
    <div className="snake-game__wrapper">
      <div className="select-game-level">
        <label htmlFor="level">Select Level : </label>
        <select name="level" id="level" onChange={(e) => handleLevelTime(e)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div className="user-score">
        <h3>Score: {score}</h3>
        {gameOver.gameEnd ? (
          <button onClick={restartGame} className="restart-btn">
            {gameOver.gameEnd && gameOver.intialStart === false
              ? "Restart"
              : "Start"}
          </button>
        ) : (
          <button
            onClick={handlePause}
            className={`${paused ? "resume-game pause-btn" : "pause-btn"}`}
          >
            {paused ? "Resume" : "Pause"}
          </button>
        )}
      </div>
      <div className="board-navigation">
        <div
          className={`${
            gameOver.gameEnd && gameOver.intialStart === false
              ? "game-board game-over-overlay"
              : "game-board"
          }`}
        >
          {Array.from({ length: numRows }, (_, rowIndex) => (
            <div key={rowIndex} className="row">
              {Array.from({ length: numCols }, (_, colIndex) => {
                const isSnake = snake.some(
                  (segment) => segment.x === colIndex && segment.y === rowIndex
                );
                const isFood = food.x === colIndex && food.y === rowIndex;
                return (
                  <div
                    key={`${colIndex}-${rowIndex}`}
                    className={`cell ${isSnake ? "snake" : ""} ${
                      isFood ? "food" : ""
                    }`}
                  ></div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="user-navigation">
          <button
            className="up"
            onClick={() => setDirection(Direction.UP)}
            disabled={gameOver.gameEnd}
          >
            Move up
          </button>
          <span>
            <button
              className="left"
              onClick={() => setDirection(Direction.LEFT)}
              disabled={gameOver.gameEnd}
            >
              Move left
            </button>
            <button
              className="right"
              onClick={() => setDirection(Direction.RIGHT)}
              disabled={gameOver.gameEnd}
            >
              Move right
            </button>
          </span>
          <button
            className="down"
            onClick={() => setDirection(Direction.DOWN)}
            disabled={gameOver.gameEnd}
          >
            Move down
          </button>
          <span className="note">
            Note: You can also play with keyboard arrow keys.
          </span>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
