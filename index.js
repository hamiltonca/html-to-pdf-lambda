const chromium = require('chrome-aws-lambda')
async function getpdf(event, context) {
    console.log('## ENVIRONMENT VARIABLES: ' + JSON.stringify(process.env))
    console.log('## CONTEXT: ' + JSON.stringify(context))
    console.log('## EVENT: ' + JSON.stringify(event))

    let browser;
    try {
        const reqContent = event.body
        console.log("request content: " + reqContent)
        console.log("launching browser...")
        const executablePath = await chromium.executablePath
        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: executablePath,
            headless: true,
            ignoreHTTPSErrors: true
        });
        console.log("browser launched, setting up page.");
        let page = await browser.newPage();
        await page.setContent(reqContent)
        console.log("page content set... generating pdf")
        const pdf = await page.pdf({
            format: "letter",
            printBackground:true
        })
        const retContent = formatResponse(pdf)
        console.log("retContent: " + JSON.stringify(retContent))
        return retContent

    }
    catch(e) {
        console.error("exception caught ", e)
        return formatError(e)
    }
    finally {
        if (browser) {
            console.log("closing browser")
            await browser.close()
            console.log("browser closed, returning content")
        }
    }
}
function formatResponse(pdf) {
    console.log("formatting response")
    return {
        "statusCode": 200,
        "headers" : {
            "Content-Type": "application/pdf"
        },
        "body" : pdf
    }
}
function formatError(e) {
    console.log("formatting error response")
    return {
        "statusCode" : 500,
        "headers" : {
            "Content-type" : "text/plain"
        },
        "body" : "An error occurred." + e.toString()

    }
}
exports.handler = getpdf

/**
 * Start test code that can run locally.
 * Writes the pdf file "testfile.pdf" to the local dir
 * with the test content below.
 *
 */

const testfile = 'testfile.pdf'
const event = {body:"<html><body><h1>hello</h1></body></html>"}
const pdf = exports.handler(event, {})

const fs = require('fs')
pdf.then( content => {
    console.log("pdf produced. Writing to file: " + testfile)
    fs.writeFileSync(testfile, content.body)
}).catch( error => {
    console.error("Error:", error)
})
