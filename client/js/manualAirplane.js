var ManualAirplane = function (x, y, runwayX, runwayY, infoX, infoY, keyCodes) {
    //var manualPlane = new Airplane(x, y);
    this.keyCodes = keyCodes || false;
    this.x = x;
    this.y = y;
    this.infoX = infoX;
    this.infoY = infoY;
    this.runwayX = runwayX;
    this.runwayY = runwayY;
    this.shoot = false;
    //return manualPlane;

};

ManualAirplane.prototype = new Airplane();
ManualAirplane.prototype.keyDown = function (keyCode) {
    if (keyCode == this.keyCodes.up) {
        if (this.altitude == this.altitudeMax) {
            this.shoot = true;
        } else {
            this.changeAlt = 1;
        }
    }
    if (keyCode == this.keyCodes.down) {
        this.changeAlt = -1;
    }
    if (keyCode == this.keyCodes.left) this.rotate = -1;
    if (keyCode == this.keyCodes.right) this.rotate = 1;
};

ManualAirplane.prototype.keyUp = function (keyCode) {
    if (keyCode == this.keyCodes.left || keyCode == this.keyCodes.right) this.rotate = false;
};
