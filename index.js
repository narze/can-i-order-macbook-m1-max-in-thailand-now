import puppeteer from "puppeteer"
import * as fs from "fs"
;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36 Edg/95.0.1020.38"
  )
  // await page.setViewport({
  //   width: 800,
  //   height: 2000,
  // })
  // await page.setDefaultNavigationTimeout(0)

  await page.goto("https://www.apple.com/th/shop/buy-mac/macbook-pro", {
    waitUntil: "networkidle2",
  })

  // console.log("page loaded")
  // await page.screenshot({ path: "apple.png" })
  // console.log("screenshot taken")

  await page.waitForSelector(
    ".shipdeliverydates .as-purchaseinfo-dudeinfo-deliverymsg"
  )

  const result = await page.evaluate((resultsSelector) => {
    const els = Array.from(document.querySelectorAll(resultsSelector))
    return els.map((el) => {
      return el.textContent.trim()
    })
  }, ".shipdeliverydates .as-purchaseinfo-dudeinfo-deliverymsg")

  console.log(result)

  if (result[4].includes("ไม่พร้อม")) {
    // NO
    console.log("NO")
    fs.writeFileSync(
      "README.md",
      `<center><h1>NO</h1></center>\n\nUpdated at ${new Date().toLocaleString()}`
    )
  } else {
    console.log("YES!!!")
    fs.writeFileSync(
      "README.md",
      `<center><h1>YES</h1></center>\n\nUpdated at ${new Date().toLocaleString()}`
    )
  }

  await browser.close()
})()
