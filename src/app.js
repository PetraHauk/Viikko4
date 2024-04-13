import express from 'express';
import api from './api/index.js';

const app = express();

app.use('/public', express.static('public'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/v1', api);

app.get('/', (req, res) => {
    res.send('Welcome to my REST API!');
});

app.get('/api/v1/cats', (req, res) => {
    const cat = {
        cat_id: 1,
        name: 'Viski',
        birthdate: '2023-02-01',
        weight: 12,
        owner: 3,
        image: 'https://loremflickr.com/320/240/cat',
    };
    res.json(cat);
});

export default app;
