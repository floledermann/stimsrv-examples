const puppeteerClient = require("stimsrv-client-puppeteer");

module.exports = {
  clients: {
    "browser-simple": puppeteerClient({
      // By default, puppeteer will open a browser window on the stimsrv server,
      // to ensure pixel-perfect rendering of the output.
      // If you want to suppress the puppeteer window and accept less accurate rendering, uncomment the next line.
      //headless: true,
    })
  }
}
  
