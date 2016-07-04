var socket = io('http://localhost');


var client = {
    width: 1200,
    height: 870,
    timer: 20,
    airplanes: [],
    bullets: [],
    animations: [],
    colors: {
        field: '#FDFDFD',
        bullet: '#333333',
        runway: '#666666',
        info: '#333333'
    }
};

client.initialize = function () {
    var _this = this;

    this.res.imageInit();

    this.canvas = window.gameCanvas;
    this.ctx = this.canvas.getContext("2d");

    this.canvas.width  = this.width;
    this.canvas.height = this.height;

    this.ctx.fillStyle = client.colors.field;
    this.ctx.fillRect(0,0,this.width, this.height);


    window.addEventListener('keydown', function (e) {
        client.airplanes.forEach(function (plane) {
            plane.keyDown && plane.keyDown(e.keyCode);
        });
    });

    window.addEventListener('keyup', function (e) {
        client.airplanes.forEach(function (plane) {
            plane.keyUp && plane.keyUp(e.keyCode);
        });
    });



    client.gameConnect();
    setInterval(client.step.bind(this), this.timer);
};

client.step = function () {
    client.erase(this.ctx);

    client.animations.forEach(function (anim, i) {
        if (!anim.step()) delete client.animations[i];
    });

    if (client.playerID != undefined && client.gameStarted) client.gameSync();

    client.draw(this.ctx);
};

client.draw = function () {
    client.ctx.fillStyle = "#FAFAFA";
    client.ctx.fillRect(0, 800, client.width, 70);

    client.airplanes.forEach(function (plane) {
        plane.drawInfo(client.ctx);
        plane.drawRunway(client.ctx);
    });

    client.animations.forEach(function (anim, i) {
        anim.draw(client.ctx);
    });

    client.airplanes.forEach(function (plane) {
        plane.draw(client.ctx);
    });

    client.bullets.forEach(function (bullet, i) {
        if (!bullet) return;
        client.ctx.fillStyle = client.colors.bullet;
        client.ctx.beginPath();
        client.ctx.arc(bullet.x, bullet.y, 2, 0, 2 * Math.PI, false);
        client.ctx.fill();
    });
};

client.erase = function () {
    /*client.animations.forEach(function (anim, i) {
        anim.erase(client.ctx);
    });

    client.airplanes.forEach(function (plane) {
        plane.eraseInfo(client.ctx);
        plane.eraseRunway(client.ctx);
        plane.erase(client.ctx);
    });

    client.bullets.forEach(function (bullet, i) {
        if (!bullet) return;
        client.ctx.fillStyle = client.colors.field;
        client.ctx.beginPath();
        client.ctx.arc(bullet.x, bullet.y, 3, 0, 2 * Math.PI, false);
        client.ctx.fill();
    });
     */

    client.ctx.clearRect(0,0, client.width, client.height);
};

client.gameConnect = function(rid) {
    socket.emit('assingPlayerID', rid, function (pid, rid) {
        client.playerID = pid;
        console.log('connected with PID:' + pid + ' to room #' + rid);
    });
};

client.gameSync = function () {
    socket.emit('sync', {
        pid: client.playerID,
        changeAlt: client.mp.changeAlt,
        shoot: client.mp.shoot,
        rotate: client.mp.rotate
    }, function (data) {
        if (data.airplanes[0].pid == client.playerID) {
            mp = data.airplanes[0];
            sp = data.airplanes[1];
        } else {
            mp = data.airplanes[1];
            sp = data.airplanes[0];
        }

        client.remotePlayer.x = sp.x;
        client.remotePlayer.y = sp.y;
        client.remotePlayer.angle = sp.angle;
        client.remotePlayer.fuel = sp.fuel;
        client.remotePlayer.altitude = sp.altitude;

        client.mp.x = mp.x;
        client.mp.y = mp.y;
        client.mp.angle = mp.angle;
        client.mp.fuel = mp.fuel;
        client.mp.altitude = mp.altitude;

        client.bullets = data.bullets;
    });
    client.mp.shoot = false;

};

client.drawCrash = function (x, y) {
    client.animations.push(new Animation('explosionSprite', x-96/2, y-96/2, 96, 96, 20));
};

socket.on('crash', function (data) {
    client.drawCrash(data.x, data.y);
    console.log(data);
});

socket.on('gameStart', function (data) {
    var mp, sp;
    console.log(data);

    console.log(data.airplanes[0].pid,client.playerID);
    if (data.airplanes[0].pid == client.playerID) {
        mp = data.airplanes[0];
        sp = data.airplanes[1];
    } else {
        mp = data.airplanes[1];
        sp = data.airplanes[0];
    }

    client.mp = new ManualAirplane(mp.x, mp.y, mp.runwayX, mp.runwayY, mp.infoX, mp.infoY, {up: 38, down: 40, left: 37, right: 39}); // main player
    client.airplanes.push(client.mp);

    client.remotePlayer = new Airplane(sp.x, sp.y, sp.runwayX, sp.runwayY, sp.infoX, sp.infoY); // internet guy
    client.airplanes.push(client.remotePlayer);

    client.gameStarted = true;
});


