import axios from 'axios'
import {config} from 'dotenv'
import express from 'express'
import { GoogleSpreadSheet } from 'google-spreadsheet'

config()

const app = express()

const JOKE_API = 'https://v2.jokeapi.dev/joke/Programming?type=single'
const TELELGRAM_URI = 'https://api.telegram.org/bot${process.env.TELEGRAM_API_TOKEN}/sendMessage'

app.use(express.json())
app.use(
    express.urlencoded(
        {
            extended: true
        }
    )
)

const doc = new GoogleSpreadSheet(process.env.GOOGLE_SPREADSHEET_ID)
await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
  
//TODO
app.post('/new-message', async (req, res) => {
    const { message } = req.body

    const messageText = message?.text?.toLowerCase()?.trim()
    const chatID =  message?.chat?.id
    if (!messageText || !chatID) {
        return req.sendStatus(400)
    }

    //TODO

    
    try {
        await axios.post(TELELGRAM_URI, {
            chat_id: chatID,
            text: messageText
        })
        res.send('Done')
    } catch (e) {
        console.log(e)
        res.send(e)
    }
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server runs on port ${PORT}`)
})