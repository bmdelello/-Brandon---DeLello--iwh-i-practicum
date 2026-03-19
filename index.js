const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('dotenv').config();
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;

// ROUTE 1 - Homepage: GET all pets and display them in a table
app.get('/', async (req, res) => {
    const url = 'https://api.hubapi.com/crm/v3/objects/2-226991068?properties=name,descriptionbio,pet_age';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Pets | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
    }
});

// ROUTE 2 - Form page: GET the form to add a new pet
app.get('/update-cobj', async (req, res) => {
    try {
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
    } catch (error) {
        console.error(error);
    }
});

// ROUTE 3 - Form submit: POST new pet data to HubSpot
app.post('/update-cobj', async (req, res) => {
    const newPet = {
        properties: {
            name: req.body.name,
            descriptionbio: req.body.descriptionbio,
            pet_age: req.body.pet_age
        }
    };
    const url = 'https://api.hubapi.com/crm/v3/objects/2-226991068';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        await axios.post(url, newPet, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));