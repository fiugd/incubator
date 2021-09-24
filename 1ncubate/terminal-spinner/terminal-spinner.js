import { Spinner } from './spinner.js';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const spin = new Spinner({
	stdOut: console.log,
	message: 'Cloning a repo',
	color: '#0FF',
	doneColor: '#0FF',
	//doneMsg: 'FINISHED'
});

const longRunning = sleep(5000);
spin.until(longRunning);
await longRunning;
console.log('How about that?');
