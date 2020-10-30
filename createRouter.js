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


    router.get('/', (req, res) => {
        res.render('index.twig', {
            isAuth: req.cookies.authToken
        });
    })

    router.get('/paste', (req, res) => {
        var templateVar
        if (!isAuth(req)) {
            templateVar = 'paste_anonymous.twig'
        } else {
            templateVar = 'paste_connected.twig'
        }
        res.render('index.twig', {
            templateVar : templateVar,
            isAuth: isAuth(req)
        });
    })

    router.post('/paste', async function(req, res){
        var pastResult
        if (!isAuth(req)) {
            pastResult = await PasteController.createAnoPaste(req.body)
        } else {
            pastResult = await PasteController.createUserPaste(req.body, req.cookies.authToken)
        }
        res.render('index.twig', {
            success: "The paste has been successfully created, the slug is: " + pastResult.slug
        });
    })

    router.get('/signup', (req, res) => {
        res.render('index.twig', {
            templateVar: 'createUserForm.twig',
            isAuth: isAuth(req)
        });
    })

    router.post('/signup', async function(req, res) {
        const signupResult = await UserController.signup(req.body)
        return res.json(signupResult)
    })

    router.get('/login', (req, res) => {
        res.render('index.twig', {
            templateVar : 'loginForm.twig',
            isAuth: isAuth(req)
        });
    })

    router.post('/login', async function(req, res) {
        const loginResult = await UserController.login(req.body)
        res.cookie('authToken',loginResult.authToken, { maxAge: 900000, httpOnly: true });
        return res.json(loginResult)
    })

    router.get('/my-pastes', async function (req, res) {
        if (!isAuth(req)) {
            return res.status(401).end();
        }
        const user = await db.collection('users').findOne({authToken: req.cookies.authToken})
        const mypastes = await db.collection('pastes').find({ 'userId': user._id }).toArray()

        res.render('index.twig', {
            templateVar : 'pastecontent.twig',
            pastes: mypastes,
            isAuth: isAuth(req)
        });
    })
/*

    router.get('/:slug', isAuth, async function (req, res) {
        console.log(req.params.slug)

        return res.json({ slug: req.params.slug })
    })

*/

    router.get('/cleanCookies', (req, res) => {
        res.cookie('authToken', 'dirtyCookie', { maxAge: 1, httpOnly: true });
        return res.json({state: 'success'})
    })

    router.get('/:slug', async function (req, res) {
        console.log(req.params.slug)
        const response = await PasteViewController.views(req.params)
        res.render('index.twig', {
            templateVar : 'pastecontent.twig',
            response: response,
            isAuth: isAuth(req)
        });
    })
    return router
}


module.exports = createRouter
