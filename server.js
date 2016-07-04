var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
var Airplane = require('./npm-airplane');
var Bullet = require('./npm-bullet');

var players = [];
var rooms = [];

app.listen(80);

function handler(req, res) {
    fs.readFile(__dirname + '/client/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}



io.on('connection', function (socket) {
    socket.on('sync', function (data, fn) {
        if (!players[data.pid] || players[data.pid] && players[data.pid].status != 'game') return;
        var plane = players[data.pid].plane;
        var rid = players[data.pid].rid;

        if (plane.isDead) {
            io.sockets.in(rid).emit('crash', {
                x: plane.crashX,
                y: plane.crashY
            });
            console.log('crash sended to rid: #' + rid);
            plane.isDead = false;
        }

        if (data.shoot) {
            var bullet = plane.shoot();
            bullet && rooms[rid].bullets.push(new Bullet(bullet));
        }

        plane.changeAlt = data.changeAlt;
        plane.rotate = data.rotate;


        fn(collectSendingData(players[data.pid].rid));
    });


    socket.on('assingPlayerID', assignPlayerId);

    socket.on('disconnect', function () {
        //if (playerID) console.log(playerID + ' disconnected');
    });
});

function assignPlayerId(data, fn) {
    var roommate;
    var rid;

    players.forEach(function (p, i) {
        if (p.status == 'waiting') {
            roommate = p;
        }
    });

    var pid = players.push({
            status: 'waiting'
        }) - 1;
    players[pid].pid = pid;

    if (roommate) {
        this.join(roommate.rid);
        joinRoom(roommate.rid, players[pid]);
    } else {
        rid = createRoom(players[pid]);
        this.join(rid);
    }

    fn(pid);
}

function createRoom(player) {
    var rid = rooms.push({
            p1: player,
            bullets: []
        }) - 1;

    player.rid = rid;
    player.type = 1;
    player.plane = new Airplane(300, 540, 300, 500, 210, 812, 'green');

    console.log('room created, rid: #' + rid);
    return rid;
}

function joinRoom(rid, player) {
    var room = rooms[rid];
    room.p2 = player;

    player.rid = rid;
    player.type = 1;
    player.plane = new Airplane(900, 540, 900, 500, 815, 812, 'red');

    room.p1.status = 'game';
    room.p2.status = 'game';

    io.sockets.in(rid).emit('gameStart', collectSendingData(rid));

    room.timer = setInterval(function () {
        room.p1.plane.move();
        room.p2.plane.move();

        room.bullets.forEach(function (bullet, i) {
            if (!bullet.move()) {
                delete room.bullets[i];
            } else if (bullet.targetHit(room.p1.plane)) {
                delete room.bullets[i];
                room.p1.plane.crash();
            } else if (bullet.targetHit(room.p2.plane)) {
                delete room.bullets[i];
                room.p2.plane.crash();
            }
        });
    }, 1000 / 60);

    console.log('room #' + rid + ' started');
}

function collectSendingData(rid) {
    var p1 = rooms[rid].p1.plane;
    var p2 = rooms[rid].p2.plane;
    var room = rooms[rid];
    var data = {
        airplanes: [
            {
                pid: rooms[rid].p1.pid,
                x: p1.x,
                y: p1.y,
                runwayX: p1.runwayX,
                runwayY: p1.runwayY,
                infoX: p1.infoX,
                infoY: p1.infoY,
                angle: p1.angle,
                speed: p1.speed,
                fuel: p1.fuel,
                altitude: p1.altitude,
                bulletsOnPlane: p1.bulletsOnPlane
            },
            {
                pid: rooms[rid].p2.pid,
                x: p2.x,
                y: p2.y,
                runwayX: p2.runwayX,
                runwayY: p2.runwayY,
                infoX: p2.infoX,
                infoY: p2.infoY,
                angle: p2.angle,
                speed: p2.speed,
                fuel: p2.fuel,
                altitude: p2.altitude,
                bulletsOnPlane: p2.bulletsOnPlane
            }
        ],
        bullets: room.bullets
    };

    return data;
}