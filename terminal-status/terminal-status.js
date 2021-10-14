// https://xtermjs.org/docs/api/vtfeatures/

import ansiEscapes from 'https://cdn.skypack.dev/ansi-escapes';

const {
clearScreen,
	cursorHide, cursorShow,
	cursorPrevLine, cursorBackward,
	eraseLine, eraseDown,
	cursorSavePosition, cursorRestorePosition
} = ansiEscapes;


const ESC = '\x1B';
const setPosition = (h,v) => `${ESC}[${h};${v}f`;
const setMargins = (top, bottom) => `${ESC}[${top};${bottom}r`
console.log('hello')

console.log(`
${clearScreen}
hello
there${cursorSavePosition}
${setMargins(0,0)}
${setPosition(10,0)}
bottomoxies
${cursorRestorePosition}
${cursorPrevLine}
yall
`)
