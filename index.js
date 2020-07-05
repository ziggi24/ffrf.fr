const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet')

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

// app.get('/:id', (req, res) => {
//   //TODO redirect to URL 

// });
// app.post('/url', (req, res) => {
//   //TODO create a short url

// });


const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
})