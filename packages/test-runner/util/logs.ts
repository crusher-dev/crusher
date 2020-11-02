const __native__console__log = console.log;
let logs : Array<any> = [];

// Override console.log to store all the logs in a var.
console.log = function(text: any){
	logs.push({message: text, time: new Date()});
	__native__console__log(text);
}

module.exports = {
	getLogs: function(){
		return logs;
	},
	clearLogs: function(){
		logs = [];
	}
}