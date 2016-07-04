var Airplane = function (x, y, runwayX, runwayY, infoX, infoY) {
    this.x = x;
    this.y = y;
    this.infoX = infoX;
    this.infoY = infoY;
    this.runwayX = runwayX;
    this.runwayY = runwayY;
    this.speed = 0;
    this.angle = -Math.PI/2;
    this.rotate = false;
    this.bulletsOnPlane = 3;
    this.altitude = 0;
    this.changeAlt = 0;
    this.fuel = 1000;
};

Airplane.prototype = {
    maxSpeed: 3,
    angleStep: Math.PI/72,
    size: 30,
    maxBulletCnt: 3,
    bulletsRespowneRate: 0.01,
    runwaySize: 40,
    altitudeFlight: 120,
    altitudeMax: 300,
    maxFuel: 1000,
    fuelSpendSpeed: 1,


    move: function () {
        if (this.rotate) {
            this.angle += this.rotate*this.angleStep;
            this.rotate = false;
        }
        
        this.x += this.speed*Math.cos(this.angle);
        this.y += this.speed*Math.sin(this.angle);
        if (this.x > client.width) this.x = 0;
        if (this.x < 0) this.x = client.width;
        if (this.y > client.height) this.y = 0;
        if (this.y < 0) this.y = client.height;


        this.processCalcs();
    },

    processCalcs: function () {
        if (this.fuel < 0) this.changeAlt = -1;
        this.altitude = Math.max(0, Math.min(this.altitude + this.changeAlt, this.altitudeMax));

        this.speed = this.maxSpeed * this.altitude / this.altitudeMax;

        if (this.altitude < this.altitudeFlight &&
            ((this.x < this.runwayX-this.runwaySize/2 || this.x > this.runwayX+this.runwaySize/2) ||
            (this.y < this.runwayY-this.runwaySize*2.5 || this.y > this.runwayY+this.runwaySize*2.5))
        ) this.crash();

        if (this.altitude == 0 &&
            ((this.x > this.runwayX-this.runwaySize/2 || this.x < this.runwayX+this.runwaySize/2) ||
            (this.y > this.runwayY-this.runwaySize*2.5 || this.y < this.runwayY+this.runwaySize*2.5))
        ) this.landed();


        if (this.speed) this.fuel -= this.fuelSpendSpeed;
        if (this.bulletsOnPlane < this.maxBulletCnt) this.bulletsOnPlane += this.bulletsRespowneRate;
    },

    draw: function (ctx) {
        var size = this.size/2 + this.size * this.altitude / this.altitudeMax / 2;
        var sin = Math.sin(this.angle);
        var cos = Math.cos(this.angle);

        var wingLCos = Math.cos(this.angle+Math.PI/4*5);
        var wingLSin = Math.sin(this.angle+Math.PI/4*5);
        var wingRCos = Math.cos(this.angle+Math.PI/4*3);
        var wingRSin = Math.sin(this.angle+Math.PI/4*3);


        ctx.fillStyle = "green";
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2;
        ctx.beginPath();
            ctx.moveTo(this.x+cos*size/2, this.y+sin*size/2);
            ctx.lineTo(this.x-cos*size/2, this.y-sin*size/2);
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x+wingLCos*size/2, this.y+wingLSin*size/2);
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x+wingRCos*size/2, this.y+wingRSin*size/2);
        ctx.stroke();
    },

    erase: function (ctx) {
        ctx.fillStyle = client.colors.field;
        ctx.fillRect(this.x-20, this.y-25, 40, 50);
    },


    drawRunway: function (ctx) {
        ctx.fillStyle = client.colors.runway;
        ctx.fillRect(this.runwayX-this.runwaySize/2, this.runwayY-this.runwaySize*2.5, this.runwaySize, this.runwaySize*5);
    },

    eraseRunway: function (ctx) {
        ctx.fillStyle = client.colors.field;
        ctx.fillRect(this.runwayX-this.runwaySize/2, this.runwayY-this.runwaySize*2.5, this.runwaySize, this.runwaySize*5);
    },

    drawInfo: function (ctx) {
        ctx.fillStyle = client.colors.info;

        var alt = Math.max(0, (this.altitude-this.altitudeFlight)/(this.altitudeMax-this.altitudeFlight)*46);
        client.res.drawImage('altitudeMeter', ctx, {left: this.infoX+20, top: this.infoY});
        client.res.drawImage('altitudePointer', ctx, {left: this.infoX+29, top: this.infoY+46-alt});

        var fuel = 52-this.fuel/this.maxFuel*52;
        client.res.drawImage('fuelEmpty', ctx, {left: this.infoX+75, top: this.infoY-3});
        client.res.drawImage('fuelFull', ctx, {left: this.infoX+75, top: this.infoY-3, widthClip: 0, heightClip: fuel});

        var bullets = 46-this.bulletsOnPlane/this.maxBulletCnt*46;
        client.res.drawImage('bulletsEmpty', ctx, {left: this.infoX+141, top: this.infoY+2});
        client.res.drawImage('bulletsFull', ctx, {left: this.infoX+141, top: this.infoY+2, widthClip: 0, heightClip: bullets});
    },

    eraseInfo: function (ctx) {
        //ctx.fillStyle = client.colors.field;
        ctx.fillStyle = "#FAFAFA";
        ctx.fillRect(this.infoX, this.infoY-10, 175, 70);
    },


    landed: function () {
        this.fuel = this.maxFuel;
        this.bulletsOnPlane = 3;
        this.fuel = 1000;
    }
};
