const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const archiver = require('archiver');
const fs = require('fs');
const rimraf = require('rimraf');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.static('uploads'));

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    // Handle or broadcast message
  });

  ws.on('close', (code, reason) => {
    console.log(`WebSocket connection closed: Code ${code}, Reason: ${reason}`);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// File upload handling
app.post('/upload', upload.array('images'), (req, res) => {
  const files = req.files.map(file => ({
    filename: file.filename,
    originalname: file.originalname,
  }));

  // Send the new images to all connected WebSocket clients
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ files }));
    }
  });

  res.json({ files });
});

// Compress and download images
app.get('/download-images', (req, res) => {
  const archive = archiver('zip', { zlib: { level: 9 } });
  res.attachment('images.zip');
  archive.pipe(res);

  fs.readdirSync('./uploads').forEach(file => {
    archive.file(path.join(__dirname, './uploads', file), { name: file });
  });

  archive.finalize();

  // Clean up after sending the file
  archive.on('end', () => {
    rimraf.sync(path.join(__dirname, 'uploads'));
  });

  archive.on('error', (err) => {
    res.status(500).send({ error: err.message });
  });
});

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
