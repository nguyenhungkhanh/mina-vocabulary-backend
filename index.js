const Server = require('./src/server')

const routers = require('./src/routers')

const { PORT, MONGO_URI } = require('./src/configs');

const server = new Server(PORT, MONGO_URI)

server.useRouters(routers)

server.run()