const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');


const corsOptions = {
    origin: 'http://localhost:5173'
};

app.use(cors(corsOptions));

app.get('/api', (req, res) => {
    res.json({ message: 'Hello From Backend' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});