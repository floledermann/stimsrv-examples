const puppeteerClient = require("stimsrv-client-puppeteer");

module.exports = {
  clients: {
    "browser-simple": puppeteerClient()
  }
}
  
