const fs = require('fs')
fs.writeFileSync('./.env', `USERBASE_API_KEY=${process.env.USERBASE_API_KEY}\n`)