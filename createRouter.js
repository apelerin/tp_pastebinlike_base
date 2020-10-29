const Router = require('express').Router
const createUserController = require('./controllers/users.controller')
const createPasteController = require('./controllers/pastes.controller')
const createPasteViewController = require('./controllers/pastesViews.controller')


async function createRouter(db) {
    const router = Router()
    const UserController = createUserController(db)
    const PasteController = createPasteController(db)
    const PasteViewController = createPasteViewController(db)

    function isAuth(req) {
        console.log('isAuth is called now')
        if (req.cookies.authToken) {
            const token = req.cookies.authToken
            console.log('token is', token)
            const result = db.collection('users').findOne({ authToken: token })
            if (result) {
                return true
            }
        }
        return false
    }

    /* Ceci est le block de code a dupliquer pour continuer l'app */
    router.get('/', (req, res) => {
        res.render('index.twig', {
        });
    })

    router.get('/paste', (req, res) => {
        if (!isAuth(req)) {
            res.render('index.twig', {
                templateVar : 'paste_anonymous.twig'
            });
        } else {
            return res.json({test: 'test'})
        }
    })

    router.get('/cleanCookies', (req, res) => {
        res.cookie('authToken', 'dirtyCookie', { maxAge: 1, httpOnly: true });
        return res.json({state: 'success'})
    })
   
    router.post('/paste', async function(req, res){
        if (!req.isAuth) {
            const pastAnoResult = await PasteController.createAnoPaste(req.body)
            return res.json(pastAnoResult)
        } else {
            return res.json({test: 'test'})
        }
    })

    router.get('/signup', (req, res) => {
        res.render('index.twig', {
            templateVar: 'createUserForm.twig'
        });
    })

    router.post('/signup', async function(req, res) {
        const signupResult = await UserController.signup(req.body)
        return res.json(signupResult)
    })

    router.get('/login', (req, res) => {
        res.render('index.twig', {
            templateVar : 'loginForm.twig'
        }
        );
    })

    router.post('/login', async function(req, res) {
        const loginResult = await UserController.login(req.body)
        res.cookie('authToken',loginResult.authToken, { maxAge: 900000, httpOnly: true });
        return res.json(loginResult)
    })

    router.get('/my-pastes', async function (req, res) {
        if (!isAuth) {
            return res.status(401).end();
        }
        const mypastes = await db.collection('pastes').find({ 'owner.id': req.authUser._id }, 'title slug createdAt').toArray()

        return res.json({
            list: mypastes,
            isAuth: req.isAuth,
        })
    })
/*

    router.get('/:slug', isAuth, async function (req, res) {
        console.log(req.params.slug)

        return res.json({ slug: req.params.slug })
    })

*/
    router.get('/:slug', async function (req, res) {
        console.log(req.params.slug)
        const reponse = await PasteViewController.views(req.params)
        res.render('index.twig', {
            templateVar : 'pastecontent.twig'
        });
    })
    
    return router
}

module.exports = createRouter
