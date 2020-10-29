
module.exports = function createPasteController(db) {

    const pastes = db.collection('pastes')

    return{
        async createAnoPaste ({ title, content, lien}) {
            await pastes.insertOne({
                title: title, content: content, lien: lien
            })
           return { success: true }
        }

    }

}