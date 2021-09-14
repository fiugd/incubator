import ini from 'https://cdn.skypack.dev/ini';

class GitConfig {
	constructor({ root }={}){
		this.url = (root || location.origin) + '/.git/config';
	}
	async update(fn){
		await this.read();
		fn(this.config);
		await this.save();
	}
	async read(){
		const configText = await fetch(this.url).then(x=> x.ok ? x.text() : undefined);
		const ConfigProxy = (config) => {
			const get = (target, key, receiver) => {
				const ignore = target[key] ||
					['toJSON', 'toObject', 'then'].includes(key);
				if(ignore) return Reflect.get(target, key, receiver);
				target[key] = {};
				return ConfigProxy(target[key]);
			};
			return new Proxy(config, { get });
		};
		this.config = ConfigProxy(
			configText
				? ini.parse(configText)
				: {}
		);
	}
	async save(){
		const { config } = this;
		console.log(`\nsave config to ${this.url}:\n`);
		console.log(JSON.stringify(config, null, 2)+'\n\n');
		console.log(ini.encode(config, { whitespace: true }) + '\n\n');
	}
}


new GitConfig({ root: cwd }).update(config => {
	config.user.email = 'foo@email.com';
	config.user.name = 'user';

	config.other.foo.hey = true;
	config.other.wow = true;
});

