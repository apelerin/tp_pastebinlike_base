
module.exports = function createPasteViewsController(db) {

    const pastes = db.collection('pastes')

    return {
        async views({ slug }) {
        const contentpast = await pastes.findOne({ slug: slug })
        return contentpast
    },
    }
}