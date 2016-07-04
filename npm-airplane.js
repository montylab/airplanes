var client = {
    width: 1200,
    height: 800
};

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
    this.isDead = false;
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


        //console.info('move!');
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

    shoot: function () {
        if (this.bulletsOnPlane >= 1) {
            this.bulletsOnPlane--;
            return {
                x: this.x,
                y: this.y,
                angle: this.angle,
                size: this.size
            };
        }
        return false;
    },

    landed: function () {
        this.fuel = this.maxFuel;
        this.bulletsOnPlane = 3;
        this.fuel = 1000;
    },

    crash: function () {
        this.isDead = true;

        this.crashX = this.x;
        this.crashY = this.y;

        this.x = this.runwayX;
        this.y = this.runwayY+this.runwaySize;
        this.speed = 0;
        this.altitude = 0;
        this.angle = -Math.PI/2;
        this.rotate = false;
        this.changeAlt = 0;

        console.log('plane crashed');
    }
};

module.exports = Airplane;