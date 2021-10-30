import axios from 'axios'
import * as fs from 'fs'

const APPLE_BASE_URL = 'https://www.apple.com/th/shop/'

const APPLE_API = {
  FULFILL: APPLE_BASE_URL + 'fulfillment-messages',
  CONFIG: APPLE_BASE_URL + 'configUpdate',
}

const MODEL_PARTS = [
  'MKGP3TH/A', // MBP 14 + M1 Pro 8/14/16 + 16/512
  'MKGR3TH/A', // MBP 14 + M1 Pro 8/14/16 + 16/512
  'MKGQ3TH/A', // MBP 14 + M1 Pro 10/16/16 + 16/1024
  'MKGT3TH/A', // MBP 14 + M1 Pro 10/16/16 + 16/1024
  'MK183TH/A', // MBP 16 + M1 Pro 10/16/16 + 16/512
  'MK1E3TH/A', // MBP 16 + M1 Pro 10/16/16 + 16/512
  'MK193TH/A', // MBP 16 + M1 Pro 10/16/16 + 16/1024
  'MK1F3TH/A', // MBP 16 + M1 Pro 10/16/16 + 16/1024
  'MK1A3TH/A', // MBP 16 + M1 Max 10/32/16 + 32/1024
  'MK1H3TH/A', // MBP 16 + M1 Max 10/32/16 + 32/1024
]

;(async () => {
  const isBuyNow = false
  const isBuyableLists = {}

  for (const PART of MODEL_PARTS.slice(0, 100)) {
    // Configuration Check
    const {
      data: {
        body: {
          replace: {
            summary: { displayName, processorLead },
            purchaseInfo: {
              priceData: {
                fullPrice: { priceString },
              },
              isBuyable,
            },
          },
        },
      },
    } = await axios.get(`${APPLE_API.CONFIG}/${PART}`)
    console.log(
      `${PART} : ${displayName} (${processorLead}) - ${priceString} - ${isBuyable ? 'On-Sale' : 'Unavailable'}`
    )

    isBuyableLists[PART] = isBuyable
    if (isBuyable) {
      isBuyNow = true
    }
  }

  // console.log(isBuyableLists)
  // console.log(isBuyNow)

  console.log(`\n${isBuyNow ? 'YES' : 'NO'}`)
  // Write Result to Markdown
  let textWrite = `<center><h1>${
    isBuyNow ? 'YES' : 'NO'
  }</h1></center>\n\nUpdated at ${new Date().toLocaleString()}\n\n`
  for (const [PART, isAvailable] of Object.entries(isBuyableLists)) {
    textWrite += `- ${PART} : ${isAvailable}\n`
  }
  fs.writeFileSync('README.md', textWrite)
})()
