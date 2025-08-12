const express = require('express');
const request = require('request');
const fetch = require('node-fetch');  // تحتاج تثبيت node-fetch
const cors = require('cors');

const app = express();
app.use(cors());

function fetchJisho(keyword) {
  return new Promise((resolve, reject) => {
    const url = 'https://jisho.org/api/v1/search/words?keyword=' + encodeURIComponent(keyword);
    request(url, { json: true }, (err, res, body) => {
      if (err) return reject(err);
      resolve(body);
    });
  });
}

async function fetchTatoebaExamples(keyword) {
  try {
    const url = `https://tatoeba.org/en/api_v0/search?query=${encodeURIComponent(keyword)}&from=ja&to=eng&limit=3`;
    const res = await fetch(url);
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    return [];
  }
}

app.get('/jisho', async (req, res) => {
  const keyword = req.query.keyword || '';
  if (!keyword) {
    return res.status(400).json({ error: 'كلمة البحث مطلوبة' });
  }

  try {
    const jishoData = await fetchJisho(keyword);
    const examples = await fetchTatoebaExamples(keyword);

    res.json({
      jisho: jishoData,
      examples: examples.map(ex => ({
        sentence: ex.text,
        translation: ex.translations && ex.translations.length > 0 ? ex.translations[0].text : '',
        lang: ex.lang
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
