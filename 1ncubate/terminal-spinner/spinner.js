import ansiEscapes from 'https://cdn.skypack.dev/ansi-escapes';
import chalk from "https://cdn.skypack.dev/-/chalk@v2.4.2-3J9R9FJJA7NuvPxkCfFq/dist=es2020,mode=imports/optimized/chalk.js";

const levels = {
	disabled: 0,
	basic16: 1,
	more256: 2,
	trueColor: 3
}
chalk.enabled = true;
chalk.level = levels.trueColor;

// thanks @ https://github.com/sindresorhus/cli-spinners/blob/main/spinners.json
const spinners = {
	"dots": {
		"interval": 80,
		"frames": [
			"⠋",
			"⠙",
			"⠹",
			"⠸",
			"⠼",
			"⠴",
			"⠦",
			"⠧",
			"⠇",
			"⠏"
		]
	},
	"aesthetic": {
		"interval": 80,
		"frames": [
			"▰ ▱ ▱ ▱ ▱ ▱ ▱",
			"▰ ▰ ▱ ▱ ▱ ▱ ▱",
			"▰ ▰ ▰ ▱ ▱ ▱ ▱",
			"▰ ▰ ▰ ▰ ▱ ▱ ▱",
			"▰ ▰ ▰ ▰ ▰ ▱ ▱",
			"▰ ▰ ▰ ▰ ▰ ▰ ▱",
			"▰ ▰ ▰ ▰ ▰ ▰ ▰",
			"▰ ▱ ▱ ▱ ▱ ▱ ▱"
		]
	},
	"bouncingBall": {
		"interval": 80,
		"frames": [
			"( ●    )",
			"(  ●   )",
			"(   ●  )",
			"(    ● )",
			"(     ●)",
			"(    ● )",
			"(   ●  )",
			"(  ●   )",
			"( ●    )",
			"(●     )"
		]
	},
	"pong": {
		"interval": 80,
		"frames": [
			"▐⠂       ▌",
			"▐⠈       ▌",
			"▐ ⠂      ▌",
			"▐ ⠠      ▌",
			"▐  ⡀     ▌",
			"▐  ⠠     ▌",
			"▐   ⠂    ▌",
			"▐   ⠈    ▌",
			"▐    ⠂   ▌",
			"▐    ⠠   ▌",
			"▐     ⡀  ▌",
			"▐     ⠠  ▌",
			"▐      ⠂ ▌",
			"▐      ⠈ ▌",
			"▐       ⠂▌",
			"▐       ⠠▌",
			"▐       ⡀▌",
			"▐      ⠠ ▌",
			"▐      ⠂ ▌",
			"▐     ⠈  ▌",
			"▐     ⠂  ▌",
			"▐    ⠠   ▌",
			"▐    ⡀   ▌",
			"▐   ⠠    ▌",
			"▐   ⠂    ▌",
			"▐  ⠈     ▌",
			"▐  ⠂     ▌",
			"▐ ⠠      ▌",
			"▐ ⡀      ▌",
			"▐⠠       ▌"
		]
	},
	"point": {
		"interval": 125,
		"frames": [
			"∙∙∙∙",
			"●∙∙∙",
			"∙●∙∙",
			"∙∙●∙",
			"∙∙∙●",
			"∙∙∙∙",
			"∙∙∙∙",
			"∙∙∙●",
			"∙∙●∙",
			"∙●∙∙",
			"●∙∙∙",
			"∙∙∙∙",
		]
	},
};

const {
	cursorHide, cursorShow,
	cursorPrevLine, cursorBackward,
	eraseLine, eraseDown,
	cursorSavePosition, cursorRestorePosition
} = ansiEscapes;

class Spinner {
	constructor(args={}){
		const name = args.name || 'point';
		const { interval, frames } = spinners[name];
		this.frames = frames;
		this.interval = interval;

		this.color = args.color || '#aff';
		this.doneColor = args.doneColor || '#aff';
		this.message = args.message || 'loading';
		this.doneMsg = args.doneMsg || 'done';
		this.stdOut = args.stdOut;
	}

	async until(unresolved){
		const {
			interval, color, frames, message, stdOut, doneColor, doneMsg
		} = this;
		let done;
		let i = 0;

		stdOut(
			cursorHide +
			cursorSavePosition +
			message + ': ' +
			eraseDown
		);

		const drawFrame = () => {
			i++;
			if(frames.length === i) i = 0;
			const frame = frames[i];
			stdOut(
				eraseDown +
				cursorRestorePosition +
				message + ': ' +
				chalk.hex(color)(frame)
			);
		};
		drawFrame();
		const timer = setInterval(drawFrame, interval);

		unresolved.then(() => {
			clearInterval(timer);
			stdOut(
				cursorRestorePosition +
				eraseLine + 
				message + ': ' +
				chalk.hex(doneColor)(doneMsg) +
				cursorShow
				//cursorPrevLine
			);
			done();
		})

		return new Promise((resolve) => {
			done = resolve;
		});
	}
}

export { Spinner };
