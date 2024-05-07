// webserverExpr.js
const express = require('express')
const app = express()
const port = 3000
const path = require('path')

app.use(express.static(path.join(__dirname, 'tracking')));

app.get('/', (req, res) => {
  res.redirect('/view/index.html');  // 첫 화면을 index.html로 리다이렉션
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});