function TonedJS(give_window) {
	 var toned = {
	    // Blindly hand all members of the donor variable to the recipient
	    // Ex: give(toned, window);
	    giveSup: function(donor, recipient) {
	      recipient = recipient || {};
	      for(var i in donor)
	        recipient[i] = donor[i];
	      return recipient
	    },
	    // Like giveSup/erior, but it doesn't override pre-existing members
	    giveSub: function(donor, recipient) {
	      recipient = recipient || {};
	      for(var i in donor)
	        if(!recipient[i])
	          recipient[i] = donor[i];
	      return recipient
	    },
	    
	    arrayMake : function (me) {
	        return Array.prototype.slice.call(me);
	    },
	    capitalizeFirst : function (str, n) {
	      n = n || 1;
	      return str.substr(0,n).toUpperCase() + str.substr(n).toLowerCase();
	    },
	    mlog : function () {
	        console.log.apply(console, arguments);
	    },
	    mzip : function(arr1, arr2) {
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
	    },
	    minsert : function (arr, pos, val) {
	        arr.splice(pos, 0, val); //
	        return arr;
	    },
	    cloneObj : function(obj){
	        var str, newobj = obj.constructor === Array ? [] : {};
	        if(typeof obj !== 'object'){
	            return;
	        } else if(window.JSON){
	            str = JSON.stringify(obj), //序列化对象
	            newobj = JSON.parse(str); //还原
	        } else {
	            for(var i in obj){
	                newobj[i] = typeof obj[i] === 'object' ? cloneObj(obj[i]) : obj[i]; 
	            }
	        }
	        return newobj;
	    },
	};
	if(give_window) toned.giveSub(toned, window);
  	return toned;
};
exports.TonedJS = TonedJS;