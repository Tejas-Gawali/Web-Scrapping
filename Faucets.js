const puppeteer = require("puppeteer");
const xlsx = require("xlsx");

async function getPageData(url, page) {
  await page.goto(url);

  const h1 = await page.$eval(".detail-header h1", (h1) => h1.textContent);
  const range = await page.$eval(".range-name-details .value", (range) => range.textContent);
  const code = await page.$eval(".sku .value", (code) => code.textContent);
  const description = await page.$eval(".shortDdiv> span:nth-child(even)", (description) => description.textContent);
  const price = await page.$eval(".product-price.call-for-price span", (price) => price.textContent);
  console.log(h1);
  console.log(url);
  console.log(range);
  console.log(code);
  console.log(description);
  console.log(price);

  return {
    Product_Name: h1,
    Links : url,
    Range :range,
    Code : code,
    Description: description,
    price: price
    
  };
  //price_color
  //instock.availability
}

async function getLinks() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.jaquar.com/en/laguna-faucets#/attrFilters=32m!#-!8819&pageSize=12&orderBy=0&pageNumber=1");

  //await page.waitForSelector("#results table tr td a");
  const links = await page.$$eval(".product-item .picture.product-thumb a", (allAs) =>
    allAs.map((a) => a.href)
  );
  await browser.close();
  return links;
  //console.log(links);
  
  
}

async function main() {
  const allLinks = await getLinks() ;
  //console.log(allLinks);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const scrapeData = [];

  for(let link of allLinks){
    const data = await getPageData(link,page);
    //await page.waitFor(3000);
    scrapeData.push(data);
    
  }
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(scrapeData);
  xlsx.utils.book_append_sheet(wb, ws);
  xlsx.writeFile(wb, "faucets2.xlsx");

  
  //console.log(scrapeData);
  await browser.close();
  console.log("Done");
}
main();
