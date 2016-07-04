client.res = {
    images: {},
    imagesSrc: {
        fuelFull: 'client/images/fuelFull.png',
        fuelEmpty: 'client/images/fuelEmpty.png',
        bulletsFull: 'client/images/bulletsFull.png',
        bulletsEmpty: 'client/images/bulletsEmpty.png',
        altitudeMeter: 'client/images/altitudeMeter.png',
        altitudePointer: 'client/images/altitudePointer.png',
        explosionSprite: 'client/images/explosionSprite.png'
    },

    drawImage: function (name, ctx, options) {
        var top = (options && options.top) ? options.top : 0;
        var left = (options && options.left) ? options.left : 0;

        if (options && options.size) {
            ctx.drawImage(this.images[name], 0, 0, this.images[name].width, this.images[name].height, left, top, options.size, options.size);
        } else if (options && options.widthClip || options.heightClip) {
            ctx.drawImage(this.images[name], options.widthClip, options.heightClip, this.images[name].width, this.images[name].height, left, top+options.heightClip, this.images[name].width, this.images[name].height);
        } else {
            ctx.drawImage(this.images[name], left, top);
        }
    },

    imageInit: function () {
        for (var el in this.imagesSrc) {
            this.images[el] = new Image();
            this.images[el].src = this.imagesSrc[el];
        }
    },
};


