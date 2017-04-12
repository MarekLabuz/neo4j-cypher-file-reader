const bluebird = require('bluebird')
const fs = bluebird.promisifyAll(require('fs'))
const axios = require('axios')
const log = require('single-line-log').stdout

const url = 'http://localhost:7474/db/data/cypher'

async function readFile () {
  try {
    if (!process.argv[2] || !process.argv[3] || !process.argv[4]) {
      throw new Error('Not enough arguments, use "npm start -- [filename] [username] [password]"')
    }
    const data = (await fs.readFileAsync(process.argv[2], 'utf8'))
      .split('\n')
      .filter(l => l.length && !l.startsWith('//'))
    const noOfCommands = data.length
    const startTime = +new Date()
    for (let i = 0; i < noOfCommands; i += 1) {
      try {
        await axios.post(url, { query: data[i] }, { // eslint-disable-line no-await-in-loop
          headers: {
            Authorization: `Basic ${new Buffer(`${process.argv[3]}:${process.argv[4]}`).toString('base64')}`
          }
        })
      } catch (e) {
        console.log(`Error while executing query number ${i + 1}`)
        if (e.response.status === 401) {
          console.log('Wrong username or password')
        } else {
          console.log(e.response.data.message)
        }
        throw new Error()
      }
      log(`Progress: ${Math.floor(100 * ((i + 1) / noOfCommands))}%`, '\n')
    }
    console.log(`${noOfCommands} quer${noOfCommands > 1 ? 'ies' : 'y'} executed in ${+new Date() - startTime}ms`)
  } catch (e) {
    console.error(e.message)
  }
}

readFile()
