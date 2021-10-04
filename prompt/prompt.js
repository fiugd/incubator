/*
import chalk from 'chalk';

// enable browser support for chalk
const levels = {
	disabled: 0,
	basic16: 1,
	more256: 2,
	trueColor: 3
}
chalk.enabled = true;
chalk.level = levels.trueColor;


const sysName = chalk.rgb(60, 180, 190)('SYSTEM_NAME');
const folder = chalk.hex('#00FF00')('FOLDER');
const dollar = chalk.white.bold('DOLLAR ');

const prompt = `${sysName} ${folder} \r\n${dollar} `;

console.log('');
console.log(
	"[\\033[38;2;60;180;190mSYSTEM_NAME[\\033[39m [\\033[38;2;0;255;0mFOLDER[\\033[39m \n[\\033[37m[\\033[1mDOLLAR [\\033[22m[\\033[39m ".replace(/\[\\033/g, String.fromCharCode(0x1B))
);
*/

/*
http://pueblo.sourceforge.net/doc/manual/ansi_color_codes.html

	\u  The name of the logged-in user
	\h  The hostname up to the first '.'
	\H  The full hostname
	\n  Newline
	\$  Shows a $ for a regular user or # for root user
	\\  A literal backslash "\" character
	\W  Current Folder (working dir, I think)
*/


const profile = await fetch('/~/.profile').then(x => x.text());
const PS1 = profile.split('\n')
	.filter(x => x.trim()[0] !== '#' && x.includes('export') && x.includes('PS1'))
	.map(x => x.split('"')[1])
	.join('\n')
	.replace(/\[\\033/g, String.fromCharCode(0x1B))
	.replace(/\\n/g, '\n')
	.replace(/\\u/g, 'user')
	.replace(/\\h/g, 'hostname')
	.replace(/\\H/g, 'HOSTNAME')
	.replace(/\\W/g, 'FOLDER')
	.replace(/\\\$/g, '$');

console.log('\n' + PS1 + 'example --command\n');