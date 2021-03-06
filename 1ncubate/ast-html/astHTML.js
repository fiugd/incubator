import ansiEscapes from 'https://cdn.skypack.dev/ansi-escapes';
import * as txml from 'https://cdn.skypack.dev/txml';
//https://github.com/jspaine/html-ast-transform
//https://github.com/tobiasnickel/tXml


const {clearScreen} = ansiEscapes;
console.log(clearScreen);

const NOTES = `
it occurs to me to use ohm.js + html grammar to do all this

here's a ton of info about parsing in JS
<a href="https://tomassetti.me/parsing-in-javascript/">parsing-in-javascript</a>

also note that going from code -> AST is only part of the battle
<a href="https://stackoverflow.com/questions/49629651/how-can-i-transform-a-custom-ast-into-js-code">Stackoverflow: AST -> code</a>

<a href="https://github.com/tree-sitter/tree-sitter">tree-sitter</a>
`;

/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
	 Version: 0.9
	Author:  Stefan Goessner/2006
	Web:     http://goessner.net/ 

	https://goessner.net/download/prj/jsonxml/
*/
function json2xml(o, tab) {
	 var toXml = function(v, name, ind) {
			var xml = "";
			if (v instanceof Array) {
				 for (var i=0, n=v.length; i<n; i++)
						xml += ind + toXml(v[i], name, ind+"\t") + "\n";
			}
			else if (typeof(v) == "object") {
				 var hasChild = false;
				 xml += ind + "<" + name;
				 for (var m in v) {
						if (m.charAt(0) == "@")
							 xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
						else
							 hasChild = true;
				 }
				 xml += hasChild ? ">\n" : "/>";
				 if (hasChild) {
						for (var m in v) {
							 if (m == "#text")
									xml += v[m];
							 else if (m == "#cdata")
									xml += "<![CDATA[" + v[m] + "]]>";
							 else if (m.charAt(0) != "@")
									xml += toXml(v[m], m, ind+"\t");
						}
						xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">\n";
				 }
			}
			else {
				 xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">\n";
			}
			return xml;
	 }, xml="";
	 for (var m in o)
			xml += toXml(o[m], m, "");
	xml = xml.split('\n').filter(x=>!!x).join('\n')
	 return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}

function htmlencode (str){
	var div = document.createElement('div');
	div.appendChild(document.createTextNode(str));
	return div.innerHTML;
}

(async () => {
	const {simplify, parse} = txml;
	const pre = (x) => document.body.innerHTML += `<div class="pre">${x}</div>`.replace(/^\t\t\t/gm, '');

	pre('')
	pre(NOTES);

	pre('txml:\n'+Object.keys(txml).join('\n'));
	const parsed = txml.parse(`
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="utf-8">
				<title>Service Worker tools</title>
				<meta name="description" content="servie worker tools">
				<meta name="viewport" content="width=device-width, initial-scale=1">
				<meta name="mobile-web-app-capable" content="yes">
				<link rel="stylesheet" href="astHTML.css">
			</head>
			<body class="foo">
				<input type="text">
				<p>hello</p>
			</body>
		</html>
	`);
	//pre(JSON.stringify(parsed, null, 2));
	const simple = txml.simplifyLostLess(parsed);
	const treeMap = (node, fn) => {
		let { parent, name, value } = node;
		fn(node);
		value = !parent && !value
			? node
			: value;
		if(typeof value !== 'object' || value === null) return;
		Object.entries(value)
			.forEach(([name,value]) => {
				treeMap({value, name, parent: node }, fn)
			});
	};

	//pre(JSON.stringify(simple, null, 2));

	treeMap(simple, ({ value, parent, ...x}) => {
		if(x.name !== "_attributes") return;
		Object.entries(value)
			.forEach(([k,v]) => {
				parent.value['@'+k] = v;
			});
		delete parent.value["_attributes"];
	});

	pre('parsed:\n'+JSON.stringify(simple, null, 2));

	pre(
		`generated:\n`+
		htmlencode(
			json2xml(simple, '  ')
		)
	);
})();

