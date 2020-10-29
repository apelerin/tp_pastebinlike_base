
module.exports = function createPasteController(db) {

    const pastes = db.collection('pastes')

    return{
        async createAnoPaste ({ title, content}) {
            await pastes.insertOne({
                title: title, content: content
            })

            return { success: true }

        }

    }

}