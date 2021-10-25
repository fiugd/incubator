import JsZip from 'https://cdn.skypack.dev/@progress/jszip-esm';
import fileSaver from 'https://cdn.skypack.dev/file-saver';

const isPreview = typeof window !== 'undefined';
if(isPreview){
	const log = (x) => `<pre style="color:white;">${x}</pre>`
	console.log = (...args) => document.body.insertAdjacentHTML(
		'beforeend', log(args)
	);
}

const newZip = new JsZip();
newZip.file('hello.txt', 'hello world\n');
const zipBlob = await newZip.generateAsync({ type: "blob" });

const loadedZip = await JsZip.loadAsync(zipBlob);

console.log('Original Zip: \n\n\t' + Object.keys(newZip));
console.log('Loaded Zip: \n\n\t' + Object.keys(loadedZip));
console.log('FileSaver: \n\n\t' + Object.keys(fileSaver));

if(isPreview){
	//fileSaver.saveAs(zipBlob, 'this.zip');
	window.fileSaver = fileSaver;
	window.zipBlob = zipBlob;
	const zipname = 'test.zip';
	document.body.insertAdjacentHTML('beforeend', `
		<button
			onclick="fileSaver.saveAs(zipBlob, '${zipname}')"
		>Click To Download ${zipname}</button>
	`)
}
