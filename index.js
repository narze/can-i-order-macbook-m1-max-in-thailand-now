import puppeteer from "puppeteer"
;(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  await page.goto(
    "https://www.apple.com/th/shop/buy-mac/macbook-pro/%E0%B8%A3%E0%B8%B8%E0%B9%88%E0%B8%99-14-%E0%B8%99%E0%B8%B4%E0%B9%89%E0%B8%A7",
    { waitUntil: "networkidle2" }
  )

  // Wait for suggest overlay to appear and click "show all results".

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
  } else {
    console.log("YES!!!")
  }

  await browser.close()
})()
