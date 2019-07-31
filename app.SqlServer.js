const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000;

const config = {
    user: 'sa',
    password: 'pino1977',
    server: 'G100603NT493\\SQLEXPRESS',
    database: 'Prueba2008'
};

sql.connect(config).catch(err => debug(err));

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public/')));
// app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
// app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const nav = [
    { link: '/books', title: 'Books' },
    { link: '/authors', title: 'Authors' }
];

const bookRouter = require('./src/routes/bookRoutes')(nav);

app.use('/books', bookRouter);

app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, '/views/', 'index.html'));
    // res.render('index', { title: "My Library", list: ['a', 'b', 'c'] });
    res.render(
        'index',
        {
            title: 'My Library',
            nav
        }
    );
});

app.listen(port, () => {
    debug(`Listening on port ${chalk.green(port)}...`);
});
