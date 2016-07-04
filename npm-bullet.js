var client = {
    width: 1200,
    height: 800
};

var Bullet = function (params) {
    this.x = params.x+params.size*Math.cos(params.angle)/2;
    this.y = params.y+params.size*Math.sin(params.angle)/2;
    this.angle = params.angle;
};

Bullet.prototype = {
    speed: 5,
    size: 2,
    move: function () {
        this.x += this.speed*Math.cos(this.angle);
        this.y += this.speed*Math.sin(this.angle);

        if (this.x > client.width || this.x < 0 || this.y > client.height || this.y < 0) {
            console.log('move ', this);
            return false;
        }
        return true;
    },
    targetHit: function (plane) {
        return (this.x-plane.x)*(this.x-plane.x) + (this.y-plane.y)*(this.y-plane.y) < plane.size*plane.size/5;
    }
};

module.exports = Bullet;