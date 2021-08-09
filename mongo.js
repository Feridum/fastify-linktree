const fp = require('fastify-plugin');
const {MongoClient} = require('mongodb');
const {LinksRepository} = require('./repositories/links.js');

const mongoPlugin = fp(async function (fastify) {
    const url = fastify.config.MONGO_URL
    const client = new MongoClient(url)
    await client.connect()
    const db = client.db(fastify.config.MONGO_DB)
    const linksCollection = db.collection('links');

    console.log('Connected successfully to server')
    fastify.decorate('linksRepository', LinksRepository(linksCollection));
}, '3.x')

module.exports = {
    mongoPlugin
}