import React, { useEffect, useState } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import image from "../src/images/Tenzi-Dice.png.webp";
import "./index.css";
library.add(fas);

function App() {
  const sides = ["one", "two", "three", "four", "five", "six"];
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [timer, setTimer] = useState(0);
  const [start, setStart] = useState(false);
  const [dice, setDice] = useState(allNewDice());
  const [countRoll, setCountRoll] = useState(0);
  const [tenzies, setTenzies] = useState(false);

  function generateNewDice() {
    return {
      value: sides[Math.floor(Math.random() * sides.length)],
      isHeld: false,
      rolling: true,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDice());
    }
    return newDice;
  }

  function startGame() {
    setStartTime(Date.now());
    setStart(true);
  }

  function gameOver() {
    setEndTime(Date.now());
  }

  function rollDice() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? { ...die } : generateNewDice();
        })
      );
      setCountRoll(countRoll + 1);
    } else {
      setTenzies(false);
      setDice(allNewDice());
      setStart(false);
      setCountRoll(0);
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : { ...die };
      })
    );
  }

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstHeld = dice.find((die) => die.isHeld);
    console.log("First hold, ", firstHeld);
    const allSameValue = dice.every((die) => die.value === firstHeld?.value);
    if (allHeld && allSameValue) {
      setTenzies(true);
      gameOver();
    }
  }, [dice]);

  useEffect(() => {
    setTimer(endTime - startTime);
  }, [endTime]);

  console.log(timer);

  function msToTime() {
    let seconds = Math.floor((timer / 1000) % 60);
    let minutes = Math.floor((timer / (1000 * 60)) % 60);
    let hours = Math.floor((timer / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
  }

  return (
    <>
      {tenzies && <Confetti />}
      <main className="section">
        <div className="game-section">
          {/* <h1 className="title">Tenzie</h1> */}
          <img className="tenzi-img" src={image} alt="Tenzi game image" />
          {!tenzies && (
            <h4 className="instructions">
              <span>Instructions:</span> Roll until all dice are the same. Click
              each die to freeze it at its current value between rolls.
            </h4>
          )}
          <div>
            {!start && (
              <button className="btn" onClick={startGame}>
                Start game
              </button>
            )}
          </div>
          {start && (
            <section>
              <div className="dice-container">
                {dice.map((die) => (
                  <Die
                    key={die.id}
                    value={die.value}
                    isHeld={die.isHeld}
                    rolling={die.rolling}
                    holdDice={() => holdDice(die.id)}
                  />
                ))}
              </div>
              <div className="btn-roll">
                <button className="btn " onClick={rollDice}>
                  {tenzies ? "New Game" : "Roll"}
                </button>
              </div>
            </section>
          )}
          {tenzies && (
            <div className="score">
              <h3>Your score:</h3>
              <p>Number of rolls: {countRoll}</p>
              <p>Time to win: {msToTime()}</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
