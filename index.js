const csv = require('csv-parser')
const fs = require('fs')
const csvWriter = require('csv-write-stream')
const writer = csvWriter()

const source = process.argv[2],
  sourceData = [],
  targetData = []

fs.createReadStream(source)
  .pipe(csv())
  .on('data', ({tech, member, score}) => sourceData.push({tech, member, score: parseInt(score)}))
  .on('end', () => {
    const parsedData = sourceData.reduce((acc, row) => {
      if (!acc[row.tech]) acc[row.tech] = [row.score]
      else acc[row.tech].push(row.score)

      return acc
    }, {})

    for (let i = 1; i < 8; i++) {
      for (let tech in parsedData) {
        let value = parsedData[tech].reduce((acc, score) => {
          if (score >= i) acc++

          return acc
        }, 0)

        targetData.push({rank: i, tech, value})
      }
    }

    writer.pipe(fs.createWriteStream('target.csv'))
    targetData.forEach(row => writer.write(row))
    writer.end()
  })