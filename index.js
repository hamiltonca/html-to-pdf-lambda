const chromium = require('chrome-aws-lambda')
const fs = require('fs')
exports.handler = async (event, context) => {
    console.log('## ENVIRONMENT VARIABLES: ' + JSON.stringify(process.env))
    console.log('## CONTEXT: ' + JSON.stringify(context))
    console.log('## EVENT: ' + JSON.stringify(event))

    const reqContent = event.body
    console.log("request content: " + reqContent)
    console.log("launching browser... IS_OFFLINE: " + process.env.IS_OFFLINE)
    const browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
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
    console.log("closing browser")
    await browser.close()
    console.log("browser closed, returning content")
    const retContent = formatResponse(pdf.toString('utf-8'))
    console.log("retContent: " + retContent)
    return formatResponse(retContent)
}
const formatResponse = function(body) {
    console.log("formatting response")
    const response = {
        "statusCode": 200,
        "headers" : {
        "Content-Type": "application/pdf"
        },
        "body" : body
    }
    return response
}
// // function complete (content) {
// //     console.log(content)
// // }
// async function handler(event, context) {
//     return "hello"
// }
const event = {body:"<html><body><h1>hello</h1></body></html>"}
const pdf = exports.handler(event, {})
pdf.then( content => {
    console.log("pdf: " + content)
}).catch( error => {
    console.error("Error:" + error)
})
// const pdf = handler(event,{})
//     .then( content => {
//         console.log("Content:" + content)
//         //fs.writeFileSync('testfile.pdf', content)
//     })
//     .catch(error => console.error("error", error)).then( hugh => {
//         console.log("hugh?:" + hugh)
//     }).catch (error => console.error("Error on hugh:", error))


//
