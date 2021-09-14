import ini from 'https://cdn.skypack.dev/ini';

/*
class GitConfig {
	constructor(){}
	set(property){}
}

const setConfig = () => {
	const configUrl = 'https://beta.fiug.dev/crosshj/fiug-beta/.git/config';

	const gitConfig = ini.encode(configText);
	const configText = await fetch(configUrl).then(x=>x.text());
};

const getConfig = () => {
	const configUrl = 'https://beta.fiug.dev/crosshj/fiug-beta/.git/config';
	const configText = await fetch(configUrl).then(x=>x.text());
	const gitConfig = ini.parse(configText);
};
*/


var ConfigProxy = (config) => {
	let proxy;
	const set =  (target, key, value, receiver) => {
		//console.log(`setting ${wrapper.url}/${key} !`);
		return Reflect.set(target, key, value, receiver);
	};
	const get = (target, key, receiver) => {
		const propertyExists = target[key] ||
			['toJSON', 'toObject', 'then'].includes(key);
		if(propertyExists) return Reflect.get(target, key, receiver);
		target[key] = {};
		return ConfigProxy(target[key]);
	};
	proxy = new Proxy(config, { get, set });
	return proxy;
};

class GitConfig {
	constructor({ local }={}){
		this.url = local
			? 'local'
			: 'https://beta.fiug.dev/.git/config';
	}
	async read(){
		const configText = await fetch(this.url).then(x=> x.ok ? x.text() : undefined);
		return ConfigProxy(
			configText
				? ini.parse(configText)
				: {},
			this
		);
	}
	async save(config){
		console.log(`save config to ${this.url}:\n`);
		console.log(JSON.stringify(config, null, 2)+'\n\n');
		console.log(ini.encode(config, { whitespace: true }) + '\n\n');
	}
}

const localConfig = new GitConfig();
const config = await localConfig.read();
config.user.email = 'foo@email.com';
config.user.name = 'user';

config.other.foo.hey = true;
config.other.wow = true;


await localConfig.save(config);