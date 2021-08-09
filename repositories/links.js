const LinksRepository = (collection)=>{
    return {
        addLink: (link)=>collection.insertOne(link),
        fetchAllLinks: ()=>collection.find({}).toArray(),
    } 
}

module.exports = {
    LinksRepository
}