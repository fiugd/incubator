/*

https://github.com/RangerMauve/xterm-tui

in order to make this work, need terminal to be exposed to scripts running in terminal
right now it's only exposed using console.log

use https://github.com/GoogleChromeLabs/comlink

see https://github.com/chjj/blessed

*/

//import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.mjs";

import { XtermTUI } from 'https://beta.fiug.dev/crosshj/fiug-incubator/xterm-tui/bundle.js'

const events = {};

//fake: see note above about connection to real terminal
const terminal = {
	on: (event, handler) => {
		events[event] = handler;
	},
	cols: 90,
	rows: 40,
	write: (...args) => console.log(...args),
};

const tui = new XtermTUI(terminal);
const {widgets} = XtermTUI;
const {Box} = widgets;
const screen = tui.screen;

// Create a box perfectly centered horizontally and vertically.
const box = Box({
	top: 'center',
	left: 'center',
	width: '70%',
	height: '65%',
	label: {
		side: 'left',
		text: '{white-fg}{blue-bg} example widget {/blue-bg}{/white-fg}'
	},
	content: `that {bold}content{/bold}`,
	draggable: true,
	align: 'center',
	valign: 'middle',
	shadow: 'black',
	tags: true,
	border: { type: 'line' },
	style: {
		fg: '#f0f',
		bg: '#222',
		border: {
			fg: 'blue',
			bg: '#222'
		},
		hover: {
			bg: 'green'
		}
	}
});

// not working
box.on('click', function(data) {
  box.setContent('{center}Some different {red-fg}content{/red-fg}.{/center}');
  screen.render();
});

screen.append(box);
box.focus()
screen.render()

//console.log(Object.entries(tui))