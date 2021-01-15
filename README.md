#html-to-pdf-lambda
This is a node JS implementation using the node module chrome-aws-lambda.

This is a VERY simple script that takes is intended
to be integrated with the AWS API Gateway.
HTML is consumed as the input event and returns PDF content

To install run locally:
* clone repository
* npm i
* node run index.js
This should produce a testfile.pdf in the local directory.
  
To package for a lambda:
* rm fr node_modules
* node install --only=prod
* zip -r html-to-pdf-lambda.zip -x '.git' -x 'testfile.pdf'
* create and upload the lambda using the AWS console (sorry no CLI at this time)

Run tests locally by creating a test event with a single member named "body"
that contains the HTML.

Example:
```
<html><body><h1>hello</h1></body></html>
```
Since this test is not wired to the API gateway, the returned body will probably 
clog the log with PDF binary data.
