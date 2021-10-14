const bundleUrl = 'https://unpkg.com/xterm-tui/bundle.js'

const octalToHexEscapes = (src) => {
	return src
		.replace(/\\033/g, '\\x1b')
		.replace(/\\200/g, '\\x80') //@
		.replace(/\\016/g, '\\x0E')
		.replace(/\\017/g, '\\x0F')
		.replace(/0200/g, '128')
		.replace(/0377/g, '255')
}

const CommonWrapper = (url) => new Promise(async (resolve) => {
	const scriptSrc = await fetch(url).then(x => x.text());
	const escapedSrc = octalToHexEscapes(scriptSrc);
	eval(escapedSrc);
	resolve(self.XtermTUI);
});

const XtermTUI = await CommonWrapper(bundleUrl);

export { XtermTUI };