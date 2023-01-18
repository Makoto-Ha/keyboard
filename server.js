const randomWords = require('random-words');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api/word', (req, res) => {
  console.log('進入成功');
  res.send({
    word: randomWords()
  });
});

app.listen('3007', () => {
  console.log('http://127.0.0.1:3007');
});