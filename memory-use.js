// bookmarklet @ https://caiorss.github.io/bookmarklet-maker/

(function(){

var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
function bytesToSize( bytes, nFractDigit ){
	if (bytes === 0) return 'n/a';
	nFractDigit	= nFractDigit !== undefined ? nFractDigit : 0;
	precision = Math.pow(10, nFractDigit);
	i = Math.floor(Math.log(bytes) / Math.log(1024));
	return Math.round(bytes*precision / Math.pow(1024, i))/precision + ' ' + sizes[i];
}
console.log(`
used: ${bytesToSize(performance.memory.usedJSHeapSize, 2)}
total: ${bytesToSize(performance.memory.totalJSHeapSize, 2)}
`);

})();
