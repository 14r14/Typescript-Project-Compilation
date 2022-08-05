import {readFile} from 'fs/promises';
import * as readLine from 'readline';

const words: string[] = [];

let rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function readWords() {
  const data: any = await readFile('./words.txt');
  const array: string[] = await data.toString().split('\n');
  array.forEach((word: string) => {
    words.push(word.replace('\r', ''));
  });
}

async function chooseWord() {
  return words[Math.floor(Math.random() * words.length)];
}

async function getGuess(word: string) {
  while (true) {
    rl.question('Guess a letter: ', (answer: string) => {});
  }
}
readWords()
  .then(() => chooseWord())
  .then(word => {});
