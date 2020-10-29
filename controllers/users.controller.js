const crypto = require('crypto')

module.exports = function createUserController(db) {

    const users = db.collection('users')

    return {
        async signup({ email, pseudo, password }) {
            const alreadyEmail = await users.findOne({ email: email })
            const alreadyPseudo = await users.findOne({ pseudo: pseudo })
            if (alreadyEmail || alreadyPseudo) {
                return { error: 'User already exists' }
            }

            password = hashing(password);
            await users.insertOne({
                email: email, pseudo: pseudo, password: password
            })

            return { success: true }
        },

        async login({ email, password }) {
            const user = await users.findOne({ email: email })

            var hash =
            password = hashing(password);

            if (!(user && user.password === password)) {
                return { error: 'Bad credentials' }
            }

            user.authToken = crypto.randomBytes(20).toString('hex')
            users.save(user)

            return { success: true, authToken: user.authToken }
        }
    }


}

function hashing(s) {
    /* Simple hash function. */
    var a = 1, c = 0, h, o;
    if (s) {
        a = 0;
        for (h = s.length - 1; h >= 0; h--) {
            o = s.charCodeAt(h);
            a = (a<<6&268435455) + o + (o<<14);
            c = a & 266338304;
            a = c!==0?a^c>>21:a;
        }
    }
    return String(a);
}