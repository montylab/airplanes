var Animation = function (name, x, y, width, height, frameCnt) {
    this.frame = 0;
    this.name = name;
    this.width = width;
    this.height = height;
    this.left = x;
    this.top = y;
    this.maxFrame = frameCnt;
};

Animation.prototype = {
    step: function () {
        return this.frame++ < this.maxFrame;
    },

    draw: function (ctx) {
        //client.res.drawImage(this.name, ctx, {left: this.x, top: this.y});
        //client.res.drawImage(this.name, ctx, {left: this.x, top: this.y, widthClip: this.width, heightClip: this.height});
        ctx.drawImage(client.res.images[this.name], this.width*this.frame, 0, this.width, this.height, this.left, this.top, this.width, this.height);
    },
    erase: function (ctx) {
        ctx.fillStyle = client.colors.field;
        ctx.fillRect(this.left, this.top, this.width, this.height);
    }

};