const Fastify = require('fastify');
const pointOfView = require('point-of-view');
const handlebars = require('handlebars');
const fastifyStatic = require('fastify-static');
const fastifyEnv = require('fastify-env');
const { join } = require('path');
const { mongoPlugin } = require('./mongo.js');


const fastify = Fastify({
  logger: {
    level: 'trace',
  }
})

const schema = {
  type: 'object',
  required: ['MONGO_URL'],
  properties: {
    'MONGO_URL': {
      type: 'string',
      default: ''
    },
    'MONGO_DB': {
      type: 'string',
      default: ''
    }
  }
}

const options = {
  schema,
  dotenv: true
}

fastify.register(fastifyEnv, options)
fastify.register(mongoPlugin)

fastify.register(fastifyStatic, {
  root: join(__dirname, '/public'),
  prefix: '/public/',
})

fastify.register(pointOfView, {
  engine: {
    handlebars,
  },
  includeViewExtension: true,
  layout: './templates/layout/layout',
  options: {
    production: process.env.NODE_ENV !== 'development',
  },
  defaultContext: {
    dev: process.env.NODE_ENV === 'development'
  }
})


fastify.get('/', async (req, reply) => {
  const links = await fastify.linksRepository.fetchAllLinks()
  reply.view('./templates/main', { links });
});


const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

module.exports = {
  start
}