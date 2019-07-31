const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookController');

function bookController(bookService, nav) {
    function getIndex(req, res) {
        const url = 'mongodb://localhost:27017';
        const dbName = 'libraryApp';

        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(url);
                debug('Connected...');

                const db = client.db(dbName);

                const col = await db.collection('books');
                const books = await col.find().toArray();
                res.render(
                    'bookListView',
                    {
                        title: 'Books',
                        nav,
                        books
                    }
                );
            } catch (err) {
                debug(err.stack);
            }
            client.close();
        }());
    }

    function getById(req, res) {
        const url = 'mongodb://localhost:27017';
        const dbName = 'libraryApp';
        const { id } = req.params;

        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(url);
                debug('Connected...');

                const db = client.db(dbName);

                const col = await db.collection('books');
                const book = await col.findOne({ _id: new ObjectID(id) });

                book.details = await bookService.getBookById(book.bookId);
                debug(book.details[0].publisher[0]);

                res.render(
                    'bookView',
                    {
                        title: 'Book',
                        nav,
                        book
                    }
                );
            } catch (err) {
                debug(err.stack);
            }
            client.close();
        }());
    }

    function middleware(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect('/');
        }
    }

    return {
        getIndex,
        getById,
        middleware
    };
}

module.exports = bookController;
