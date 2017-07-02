(function(global) {
    // body...
    global.arrayMake = function (me) {
        return Array.prototype.slice.call(me);
    }
})(window)
