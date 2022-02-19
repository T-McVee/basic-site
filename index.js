const http = require('http');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  let filePath = path.join(
    __dirname,
    'public',
    req.url === '/' ? 'index.html' : `${req.url}`
  );

  let contentType = 'text/html';

  const writeRes = ({ res, code, type = {}, content }) => {
    res.writeHead(code, type);
    res.end(content, 'utf8');
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 404 Page not found
        fs.readFile(
          path.join(__dirname, 'public', '404.html'),
          (err, content) => {
            writeRes({
              res,
              code: 404,
              type: { 'Content-Type': 'text/html' },
              content,
            });
          }
        );
      } else {
        // Some server error
        writeRes({
          res,
          code: 500,
          content: `Server Error: ${err.code}`,
        });
      }
    } else {
      writeRes({
        res,
        code: 200,
        type: { 'Content-Type': contentType },
        content,
      });
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
