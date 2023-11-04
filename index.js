const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

axios.get('https://www.premierleague.com/tables')
    .then(res => {
        const $ = cheerio.load(res.data)
        
        const extractedData = [];

        $('.league-table__tbody.isPL tr').each((index, element) => {
            
            const club = $(element).find('td:nth-child(2) > a > .league-table__team-name.league-table__team-name--long.long').text().trim()
            const played = $(element).find('td:nth-child(3):not([class])').text().trim()
            const win = $(element).find('td:nth-child(4):not([class])').text().trim()
            const draw = $(element).find('td:nth-child(5):not([class])').text().trim()
            const loss = $(element).find('td:nth-child(6):not([class])').text().trim()
            const goalsScored = $(element).find('td:nth-child(7)').text().trim()
            const goalsConceded = $(element).find('td:nth-child(8)').text().trim()
            const goalsDifference = $(element).find('td:nth-child(9):not([class])').text().trim()
            const points = $(element).find('.league-table__points.points').text().trim()


            if (club) {
                extractedData.push({ club, played, win, draw, loss, goalsScored, goalsConceded, goalsDifference, points })                
            }

        })
      
        console.log(extractedData)

        const count = extractedData.length
        console.log(count);

        if (extractedData.length > 0) {
            fs.writeFileSync('output.json', JSON.stringify(extractedData, null, 2), 'utf-8')
            console.log('Data has been written to output.json')
        } else {
            console.log('No data found on the webpage.')
        }
    })
    .catch(error => {
        console.error('Error:', error)
    })
