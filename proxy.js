const express = require('express');
const request = require('request');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/jisho', (req, res) => {
  const keyword = req.query.keyword || '';
  const url = 'https://jisho.org/api/v1/search/words?keyword=' + encodeURIComponent(keyword);
  request(url).pipe(res);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
