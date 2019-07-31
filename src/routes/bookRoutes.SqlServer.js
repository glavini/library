const express = require('express');
const sql = require('mssql');
const debug = require('debug')('app:bookRoutes');

const bookRouter = express.Router();

function router(nav) {
    bookRouter.route('/')
        .get((req, res) => {
            (async function query() {
                const request = new sql.Request();
                const { recordset } = await request.query('select * from books');
                debug(recordset);
                res.render(
                    'bookListView',
                    {
                        title: 'Books',
                        nav,
                        books: recordset
                    }
                );
            }());
        });

    bookRouter.route('/:id')
        .all((req, res, next) => {
            (async function query() {
                const { id } = req.params;
                const request = new sql.Request();
                const { recordset } = await request
                    .input('id', sql.Int, id)
                    .query('select * from books where id = @id');
                [req.book] = recordset; // req.book = recordset[0];
                next();
            }());
        })
        .get((req, res) => {
            res.render(
                'bookView',
                {
                    title: 'Book',
                    nav,
                    book: req.book
                }
            );
        });

    return bookRouter;
}

module.exports = router;
