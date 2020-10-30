
module.exports = function createPasteController(db) {

    const pastes = db.collection('pastes')
     
    function linkrand() {
        var length = 5;
        var link = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
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
        }
        

    }

    

}