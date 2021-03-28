const express = require('express')
const path = require('path')
const cors = require('cors')
const fs = require('fs')
const bodyParser = require('body-parser')
const app = express()
const PORT = 5000

app.use(cors())
app.use(bodyParser())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    
    /**
     * TODO: Replace this with your mp4's file path
     */
    const FILE_PATH = `./somefile.mp4`

    const stat = fs.statSync(FILE_PATH)
    const fileSize = stat.size

    const range = req.headers.range

    if (range) {
        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
        const chunksize = (end - start) + 1
        const stream = fs.createReadStream(FILE_PATH, { start, end })

        /**
         * IMPORTANT:
         * "Content-Type" is a must for Safari
         */
        res.writeHead(206, {
            'Content-Type': 'video/mp4',
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
        })

        stream.pipe(res)

    } else {
        res.json('Provide range')
    }
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})
