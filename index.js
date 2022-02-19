const http = require('http');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 3000;

// define server
const server = http.createServer((req, res) => {
  // set file path
  let filePath = path.join(
    __dirname,
    'public',
    req.url === '/' ? 'index.html' : req.url
  );

  // set content type
  let contentType = 'text/html';

  const writeRes = ({ res, code, type = {}, content }) => {
    res.writeHead(code, type);
    res.end(content, 'utf8');
  };

  // read file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if ((err.code = 'ENOENT')) {
        // 404 Not found
        fs.readFile(
          path.join(__dirname, 'public', '404.html'),
          (err, content) => {
            writeRes({
              res,
              code: 200,
              type: { 'Content-Type': contentType },
              content,
            });
          }
        );
      } else {
        // server error
        writeRes({
          res,
          code: 500,
          content: `Server error: ${err.code}`,
        });
      }
    } else {
      // valid request
      writeRes({
        res,
        code: 200,
        type: { 'Content-Type': contentType },
        content,
      });
    }
  });
});

// Start server and set listen
server.listen(port, () => {
  console.log(`The server is running on port: ${port}`);
});
