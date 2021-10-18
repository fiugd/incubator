/*

TODO: fiug-plugins wrapped in a store abstraction

the people from eclipse theia did this, may be worth looking at
https://open-vsx.org/
https://open-vsx.org/swagger-ui/


building a VS Code extension seems to require Visual Studio (lame)
https://docs.microsoft.com/en-us/visualstudio/extensibility/the-structure-of-the-content-types-dot-xml-file?view=vs-2019
https://github.com/igorskyflyer/vscode-pack-vsix
https://fek.io/blog/how-to-create-a-vs-code-extension-with-java-script

POST: https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery
this is what VS Code online uses aka https://github.dev/crosshj/fiug-blog

*/
import ansiEscapes from 'ansiEscapes';

const { clearScreen } = ansiEscapes;
console.log(clearScreen);

const storeURL = 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery';
const body = JSON.stringify({
	filters:[{
		criteria:[
			{ filterType:8,"value":"Microsoft.VisualStudio.Code" },
			// { filterType:1,"value":"__web_extension" },
			{ filterType: 10, value: "Javascript" },
			{ filterType:12,"value":"4096" }
		],
		pageNumber:1,
		pageSize:50,
		sortBy:2,
		sortOrder:2
	}],
	assetTypes:[],
	flags:950
});
const headers = {
	'Content-Type': 'application/json',
	'Accept': 'application/json;api-version=3.0-preview.1',
	'Accept-Encoding': 'gzip',
}
const { results: [storeRes] } = await fetch(
	storeURL, { method: 'POST', body, headers }
).then(x => x.json());

console.log(storeRes.extensions.map(x=>x.displayName).join('\n'))