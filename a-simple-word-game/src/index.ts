import path = require('path');
import {readFile} from 'fs/promises';
import * as readLine from 'readline';

interface WordLetterDashes {
  word: string;
  guess: string;
  dashes: string;
}

const words: string[] = [];
const resForUpdateDashes: string[] = [];
let guessesLeft: number = 6;
let chosenWord: string;

const guessedLetters: string[] = [];

let rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function readWords(): Promise<void> {
  const data: any = await readFile(path.join(__dirname, 'words.txt'));
  const array: string[] = await data.toString().split('\n');
  array.forEach((word: string) => {
    words.push(word.replace('\r', ''));
  });
  return;
}

async function chooseWord(): Promise<string> {
  return words[Math.floor(Math.random() * words.length)];
}

function question(prompt: string): Promise<string> {
  return new Promise<string>(resolve => {
    rl.question(prompt, (input: string) => resolve(input));
  });
}

async function checkIfGuessed(guess: string): Promise<boolean> {
  if (guessedLetters.indexOf(guess) > -1) {
    return true;
  } else {
    return false;
  }
}

async function getGuess(): Promise<string> {
  while (true) {
    const answer: string = await question('Enter a letter guess: ');
    if (answer.length > 1) {
      console.log('Guess must only be one character!');
      continue;
    } else if (answer.length < 1) {
      console.log('Please enter a guess!');
      continue;
    } else if (await checkIfGuessed(answer)) {
      console.log(
        "You have already guessed this letter. Try guessing a letter you haven't before."
      );
      continue;
    } else {
      guessedLetters.push(answer);
      return answer;
    }
  }
}

async function checkIfGuessInWord(
  guess: string,
  word: string
): Promise<boolean> {
  if (word.toLowerCase().indexOf(guess) > -1) {
    return true;
  } else {
    return false;
  }
}

async function updateDashes(
  guess: string,
  word: string,
  dashes: string
): Promise<WordLetterDashes> {
  const wordArray: string[] = [];
  for (let i = 0; i < word.length; i++) {
    wordArray.push(word[i]);
  }
  wordArray.map((letter, index) => {
    if (letter === guess) {
      resForUpdateDashes[index] = letter;
    }
  });
  dashes = resForUpdateDashes.join('');
  return <WordLetterDashes>{
    word,
    guess,
    dashes,
  };
}

async function playGame(word: string) {
  while (guessesLeft > 0) {
    const dashes: string = resForUpdateDashes.join('');
    if (dashes.indexOf('-') > -1) {
      const guess = await getGuess();
      const data = <WordLetterDashes>{
        guess,
        dashes,
        word,
      };
      const inword: boolean = await checkIfGuessInWord(data.guess, data.word);
      if (inword) {
        const updatedData: WordLetterDashes = await updateDashes(
          data.guess,
          data.word,
          data.dashes
        );
        console.log(updatedData.dashes);
        continue;
      } else {
        guessesLeft--;
        console.log('Letter guessed is not in the word!');
        console.log(`You have ${guessesLeft} incorrect guesses remaining!`);
        continue;
      }
    } else {
      console.log('Congrats! You won!');
      process.exit();
    }
  }
  console.log(
    "Oops! Looks like you couldn't figure out the word! The word was: " + word
  );
  process.exit();
}

readWords()
  .then(() => chooseWord())
  .then(word => {
    chosenWord = word;
    for (let i = 0; i < word.length; i++) {
      resForUpdateDashes.push('-');
    }
  })
  .then(() => {
    playGame(chosenWord);
  });
