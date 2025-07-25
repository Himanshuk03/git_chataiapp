require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chat');

const app = express();

// this vaalaa part will allow the Next.js frontend part
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PATCH,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());

// yahaan se routes valaa part
app.use('/api', chatRoutes);

const PORT = process.env.PORT || 3210;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
