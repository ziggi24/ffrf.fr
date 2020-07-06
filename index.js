const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);
const { customAlphabet } = require('nanoid');
require('dotenv');

const db = require('./models');

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz-', 5)

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  store: new MongoStore({
    url: process.env.MONGODB_URI || "mongodb://localhost:27017/urls",
  }),
  secret: "tyler",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 * 2,
  },
}));

app.get('/', (req, res) => {
  const context = {
    newUrl: '',
    message: '',
  }
  res.render('index', context);
});

app.get('/:id', async (req, res) => {
  const { id: slug } = req.params;
  try {
    const url = await db.Url.findOne({ slug })
    if (url) {
      res.redirect(url.url);
    }
    res.redirect(`/?error=${slug} not found`);

  } catch (err) {
    console.log(err)
    res.redirect('/?error=link not found')
  }

});
app.post('/url', async (req, res, next) => {
  console.log("REQ BODY ======", req.body)
  let { slug, url } = req.body;
  try {
    if (url.includes('ffrf.fr')) {
      throw new Error("Stop it")
    }
    if (!slug) {
      slug = nanoid();
    } else {
      const existing = await db.Url.findOne({ slug })
      console.log("EXISTING ---- ", existing)
      if (existing) {
        const context = {
          newUrl: '',
          message: 'Url in Use, try another',
        }
        res.render('index', context);
      }
    }
    console.log(slug, url)
    slug = slug.toLowerCase();

    const newUrl = {
      url: url,
      slug: slug,
    }
    const created = await db.Url.create(newUrl);
    const context = {
      newUrl: `https://ffrf.fr/${created.slug}`,
      message: 'Your shortened URL is ready!',
    }
    res.render('index', context);
  } catch (err) {
    console.log(err)
    next(err)
  }

});

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  let context = {
    newUrl: '',
    message: error.message,
  };
  if (error.message.startsWith("Url validation failed:")) {
    context = {
      newUrl: '',
      message: "Please enter a valid URL",
    }
  }
  res.render('index', context);
})


const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
})