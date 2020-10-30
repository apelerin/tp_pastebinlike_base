
module.exports = function createPasteController(db) {

    const pastes = db.collection('pastes')
    const users = db.collection('users')
     
    function linkrand() {
        var length = 5;
        var link          = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           link += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return link;
    }
    
    return{
        async createAnoPaste ({ title, content }) {
            var link = linkrand();
            await pastes.insertOne({
                title: title, content: content, slug: link
            })
           return { success: true }
        },

        async createUserPaste ({title, content, isPublic}, userToken) {
            var link = linkrand();
            var user =  await users.findOne({ authToken: userToken })
            await pastes.insertOne({
                title: title, content: content, isPublic: isPublic, slug: link, userId : user._id
            })
            return { success: true }
        }
    }

    

}