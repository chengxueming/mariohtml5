(function(global) {
    // body...
    global.arrayMake = function (me) {
        return Array.prototype.slice.call(me);
    };
    global.capitalizeFirst = function (str, n) {
      n = n || 1;
      return str.substr(0,n).toUpperCase() + str.substr(n).toLowerCase();
    };
    global.mlog = function () {
        console.log.apply(console, arguments);
    };
    global.mzip = function(arr1, arr2) {
        var index1 = 0;
        var index2 = 0;
        var res = [];
        var flag = false;
        while(!flag) {
            flag = true;
            res.push([arr1[index1], arr2[index2]]);
            if(index1 < arr1.length - 1) {
                flag = false;
                index1 ++;
            }
            if(index2 < arr2.length - 1) {
                flag = false;
                index2 ++;
            }
        }
        return res;
    };
    global.minsert = function (arr, pos, val) {
        arr.splice(pos, 0, val); //
        return arr;
    }
})(window)
