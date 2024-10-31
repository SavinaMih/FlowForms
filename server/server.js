require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Use environment variable or fallback to 3000
const cors = require('cors');

const corsOptions = {
    origin: process.env.ORIGIN || 'http://localhost:5173'
};

app.use(cors(corsOptions));

app.get('/api', (req, res) => {
    res.json({ message: 'Hello From Backend' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
