import ini from 'https://cdn.skypack.dev/ini';

//TODO: make importing from something local less annoying
//ALSO: make errors more obvious (hint: import errors are not obvious)
//import localforage from "https://beta.fiug.dev/shared/vendor/localforage.min.js"

import localforage from 'https://cdn.skypack.dev/localforage';
import ansiEscapes from 'https://cdn.skypack.dev/ansi-escapes';
import chalk from "chalk";

function getStores(){
	const files = localforage
		.createInstance({
				name: 'service-worker',
				storeName: 'files',
		});
	return { files };
};

chalk.enabled = true;
chalk.level = 3;
const grey = x => console.log(chalk.hex('#ccc')(x));
const blue = x => console.log(chalk.hex('#adf')(x));
const yellow = x => console.log(chalk.hex('#fd0')(x));

const {clearScreen} = ansiEscapes;
console.log(clearScreen);


yellow('The point of this exercise:')
grey(`
create a command/util which clears fiug state:
- file, services, changes, handlers stores
- cache storage
- session storage [needs to be exposed in app, or just not used]
- local storage [needs to be exposed in app, or just not used]

This should cause the service worker to update in a new state on refresh.
see index.service.test.html and all of the things it does

Some of the code here could be used for:
- creating a disk/memory usage (du) utility
- pulling all files for offline
- reading/writing .git folder, ie. git config

`.trim());


const stores = getStores();
const keys = await stores.files.keys();

yellow('\n' + 'Some files:');
grey([...keys.slice(0,5), '...'].join('\n'));

const cwd = self.location.toString()
	.split(self.location.host+'/!/')[1]
	.split('/')
	.slice(0,-1)
	.join('/');
yellow('\n' + 'Current Working Dir:');
grey(cwd);
