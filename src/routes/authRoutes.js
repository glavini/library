const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

const authRouter = express.Router();

function router(nav) {
    authRouter.route('/signUp')
        .post((req, res) => {
            const { username, password } = req.body;
            const url = 'mongodb://localhost:27017';
            const dbName = 'libraryApp';

            (async function addUser() {
                let client;
                try {
                    client = await MongoClient.connect(url);
                    debug('Connected...');

                    const db = client.db(dbName);

                    const user = { username, password };
                    const result = await db.collection('users').insertOne(user);
                    debug(result);
                    req.login(result.ops[0], () => {
                        res.redirect('/auth/profile');
                    });
                } catch (err) {
                    debug(err.stack);
                }
                client.close();
            }());
        });
    authRouter.route('/signin')
        .get((req, res) => {
            res.render('signin', {
                nav,
                title: 'SignIn'
            });
        })
        .post(passport.authenticate('local', {
            successRedirect: '/auth/profile',
            failureRedirect: '/'
        }));
    authRouter.route('/profile')
        .all((req, res, next) => {
            if (req.user) {
                next();
            } else {
                res.redirect('/');
            }
        })
        .get((req, res) => {
            res.json(req.user);
        });
    authRouter.route('/logout')
        .get((req, res) => {
            req.logOut();
            res.redirect('/');
        });

    return authRouter;
}

module.exports = router;
