const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

const locations = {
  Akan: {
    lat: 5.5912045,
    lng: -0.2497705
  },
  Alabama: {
    lat: 32.5562859,
    lng: -88.9247942
  },
  Anguilla: {
    lat: 18.2206,
    lng: -63.0686
  },
  Bahamas: {
    lat: 25.0343,
    lng: -77.3963
  },
  Belize: {
    lat: 17.1899,
    lng: -88.4976
  },
  Benin: {
    lat: 9.3077,
    lng: 2.3158
  },
  Bermuda: {
    lat: 32.3078,
    lng: -64.7505
  },
  Brazil: {
    lat: -14.2350,
    lng: -51.9253
  },
  Chicago: {
    lat: 41.8781,
    lng: -87.6298
  },
  Colombia: {
    lat: 4.5709,
    lng: -74.2973
  },
  Cuba: {
    lat: 21.5218,
    lng: -77.7812
  },
  Detroit: {
    lat: 42.3314,
    lng: -83.0458
  },
  Dominica: {
    lat: 15.4150,
    lng: -61.3710
  },
  Dominican_Republic: {
    lat: 18.7317,
    lng: -70.1627
  },
  Fulani: {
    lat: 14.4974,
    lng: 14.4524
  },
  Georgia: {
    lat: 32.1656,
    lng: -82.9001
  },
  Grenada: {
    lat: 12.1165,
    lng: -61.6790
  },
  Guadeloupe: {
    lat: 16.2650,
    lng: -61.5510
  },
  Haiti: {
    lat: 18.9712,
    lng: -72.2852
  },
  Hausa: {
    lat: 12.2413,
    lng: 9.9074
  },
  Igbo: {
    lat: 6.9792,
    lng: 3.9980
  },
  Jamaica: {
    lat: 18.1096,
    lng: -77.2975
  },
  Kanem: {
    lat: 14.8781,
    lng: 15.4068
  },
  Kangaba: {
    lat: 11.9428,
    lng: 8.4157
  },
  Kongo: {
    lat: -4.0383,
    lng: 21.7587
  },
  Louisiana: {
    lat: 30.9843,
    lng: -91.9623
  },
  Mali: {
    lat: 17.5707,
    lng: -3.9962
  },
  Mande: {
    lat: 12.545556,
    lng: -8.085556
  },
  Mexico: {
    lat: 21.1619,
    lng: -86.8515
  },
  Mississippi: {
    lat: 32.3547,
    lng: -89.3985
  },
  Nevis: {
    lat: 17.1554,
    lng: -62.5796
  },
  New_York: {
    lat: 40.7128,
    lng: -74.0060
  },
  Panama: {
    lat: 8.5380,
    lng: -80.7821
  },
  Peru: {
    lat: -9.19,
    lng: -75.0152
  },
  Puerto_Rico: {
    lat: 18.2208,
    lng: -66.5901
  },
  Saint_Eustatius: {
    lat: 17.4890,
    lng: -62.9736
  },
  St_Lucia: {
    lat: 13.9094,
    lng: -60.9789
  },
  Tennessee: {
    lat: 35.5175,
    lng: -86.5804
  },
  Texas: {
    lat: 31.9686,
    lng: -99.9018
  },
  Trinidad: {
    lat: 10.6918,
    lng: -61.2225
  },
  Venezuela: {
    lat: 6.4238,
    lng: -66.5897
  },
  Virginia: {
    lat: 37.4316,
    lng: -78.6569
  },
  Wolof: {
    lat: 15.397663,
    lng: -15.148774
  },
  Yoruba: {
    lat: 7.4832132,
    lng: 4.3997974
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

  app.listen(8000, () => {
    console.log('> Ready on http://localhost:3100');
  });

  io.listen(3101);
})();
