const express = require('express');
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3003;

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueFileName = shortid.generate() + path.extname(file.originalname);
    cb(null, uniqueFileName);
  }
});

const upload = multer({ storage });

app.use(express.static('uploads'));

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }

  try {
    const response = await axios.get('https://api.ipify.org/?format=json');
    const serverIP = response.data.ip;
    
    const fileUrl = `http://${serverIP}:${PORT}/${req.file.filename}`;
    res.send(fileUrl);
  } catch (error) {
    console.error('Error getting server IP:', error);
    res.status(500).send('Error getting server IP.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
