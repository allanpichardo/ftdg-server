const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

let https;
try {
  https = require('http').createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/talkinghead.allanpichardo.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/talkinghead.allanpichardo.com/fullchain.pem'),
    requestCert: false,
    rejectUnauthorized: false
  },app);
} catch (e) {
  https = require('http').createServer(app);
}

const io = require('socket.io')(https);

app.use(express.static(__dirname + '/public'));
app.use(cors());

const locations = {
  Brazil: {
    lat: -12.9017557,
    lng: -38.4901453
  },
  Detroit: {
    lat: 42.3314,
    lng: -83.0458
  },
  Chicago: {
    lat: 41.8781,
    lng: -87.6298
  },
  Memphis: {
    lat: 35.1291054,
    lng: -90.1108696
  },
  New_York: {
    lat: 40.7128,
    lng: -74.0060
  },
  Baltimore: {
    lat: 39.2846854,
    lng: -76.6905362
  },
  Atlanta: {
    lat: 33.7676931,
    lng: -84.4906436
  },
  New_Orleans: {
    lat: 30.0329222,
    lng: -90.0226465
  },
  Puerto_Rico: {
    lat: 18.3892246,
    lng: -66.1305123
  },
  Colombia: {
    lat: 10.4001968,
    lng: -75.5435449
  },
  Dominican_Republic: {
    lat: 18.4800391,
    lng: -69.9818994
  },
  Barbados: {
    lat: 13.1013085,
    lng: -59.6141029
  },
  Jamaica: {
    lat: 18.0179332,
    lng: -76.8356757
  },
  Trinidad_and_Tobago: {
    lat: 10.6685091,
    lng: -61.5314139
  },
  Honduras: {
    lat: 16.3233719,
    lng: -86.5408624
  },
  Haiti: {
    lat: 18.5790242,
    lng: -72.3544999
  },
  Senegal: {
    lat: 14.7110218,
    lng: -17.5008444
  },
  Ghana: {
    lat: 5.5912045,
    lng: -0.2497694
  },
  Angola: {
    lat: -8.8535258,
    lng: 13.2140645
  },
  Benin: {
    lat: 6.4928025,
    lng: 2.6078194
  },
  Nigeria: {
    lat: 6.5480503,
    lng: 3.2139196
  }
};

let clients = [];

function getCoordinates(region) {
  let underscored = region.replace(' ', '_');
  return locations[underscored];
}

io.on('connection', function(socket){
  console.log('> New user connected');
  socket.on('disconnect', () => {
    console.log('> User disconnected');
    clients = clients.filter((item) => {
      return item !== socket;
    });
  });
  clients.push(socket);
});

(async () => {
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/main.html');
  });

  app.post('/segment', (req, res) => {
    let msg = req.query.line;
    console.log(`> Received segment ${msg}`);
    const parts = msg.split(',');
    let start = getCoordinates(parts[0]);
    let end = getCoordinates(parts[1]);

    clients.forEach((socket) => {
      socket.emit('draw line', {
        start: start,
        end: end
      });
    });

    res.json({
      execution: true,
      message: "line emitted"
    });
  });

  https.listen(3100, () => {
    console.log('> Ready on http://localhost:3100');
  });

})();
