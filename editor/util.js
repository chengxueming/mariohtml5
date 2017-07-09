(function(global) {
    // body...
    global.arrayMake = function (me) {
        return Array.prototype.slice.call(me);
    }
    global.capitalizeFirst = function(str, n) {
      n = n || 1;
      return str.substr(0,n).toUpperCase() + str.substr(n).toLowerCase();
    }
})(window)
