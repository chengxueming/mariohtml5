/**
当一种行为发生时，发送一个消息，所有订阅（on ）了这个消息的类都会执行相应方法
用途：避免一个在消息发送者内部填写过多的代码，而是在需要响应的类内自己维护
场景：
*/

Mario.MessageHandler = function (argument) {
	// body...
	this.HandlerMap = {};
}

Mario.MessageHandler.prototype = {
	// body...

	/**触发消息
	*/
	Fire: function(messageName,jsonParam) {
		for (var i in this.HandlerMap[messageName]) {
			object = this.HandlerMap[messageName][i].Obj;
			this.HandlerMap[messageName][i].CallFunc(object,jsonParam);
		}
	},

	/**订阅消息
	object 订阅的类 this
	*/
	On: function(object,messageName,func) {
		if (!this.HandlerMap.hasOwnProperty(messageName)) {
			this.HandlerMap[messageName] = [];
		}
		var objMsg = {
			Obj: object,
			CallFunc: func
		};
		this.HandlerMap[messageName].push(objMsg);
	}
};