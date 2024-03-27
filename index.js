require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const csvParser = require('csv-parser');
const axios = require('axios');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const eventSchema = new mongoose.Schema({
  event_Name: String,
  city_Name: String,
  date: Date,
  time: String,
  latitude: Number,
  longitude: Number
});
const apiKey = process.env.OPENWEATHERMAP_API_KEY;
const distanceMatrixApiKey = process.env.DISTANCEMATRIX_API_KEY;
const Event = mongoose.model('Event', eventSchema);

app.post('/events', (req, res) => {
  fs.createReadStream('events.csv')
    .pipe(csvParser())
    .on('data', (row) => {
      const event = new Event(row);
      event.save();
    })
    .on('end', () => {
      res.status(200).send('CSV data has been successfully uploaded.');
    });
});

app.get('/events', async (req, res) => {
  const events = await Event.find({});
  res.json(events);
});
app.get('/events/find', async (req, res) => {
  const { latitude, longitude, date, page = 1, pageSize = 10 } = req.query;
  const startDate = new Date(date);
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 14);

  const totalEvents = await Event.countDocuments({
    date: { $gte: startDate, $lte: endDate }
  });

  const events = await Event.find({
    date: { $gte: startDate, $lte: endDate }
  })
    .sort({ date: 1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  const enrichedEvents = await Promise.all(events.map(async (event) => {
    const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${event.latitude}&lon=${event.longitude}&appid=${apiKey}`);
    const distanceResponse = await axios.get(`https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${latitude},${longitude}&destinations=${event.latitude},${event.longitude}&key=${distanceMatrixApiKey}`);

    return {
      ...event._doc,
      weather: weatherResponse.data.weather,
      distance: distanceResponse.data.distance
    };
  }));

  res.json({
    events: enrichedEvents,
    page,
    pageSize,
    totalEvents,
    totalPages: Math.ceil(totalEvents / pageSize),
    
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));