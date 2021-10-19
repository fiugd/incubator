/*
<section id="page">
	<header>Header</header>
	<nav>Navigation</nav>
	<main>Main area</main>
	<footer>Footer</footer>
	<div id="sep1" class="horizontal"></div>
	<div id="sep2" class="vertical"></div>
	<div id="sep3" class="horizontal"></div>
</section>


#page {
	display: grid;
	width: 100%;
	height: 250px;
	grid-template-areas:
		"head head head"
		"sep1 sep1 sep1"
		"nav sep2 main"
		"nav sep2 sep3"
		"nav sep2 foot";
	grid-template-columns: 150px 5px 1fr;
	grid-template-rows: 50px 5px 1fr 5px 30px;
}



#page > header {
  grid-area: head;
  background-color: #8ca0ff;
}

#page > nav {
  grid-area: nav;
  background-color: #ffa08c;
}

#page > main {
  grid-area: main;
  background-color: #ffff64;
}

#page > footer {
  grid-area: foot;
  background-color: #8cffa0;
}
*/

const layout = {
	content: [{
		content: [
			{ id: 'head' }
		],
		height: '150px'
	}, {
		content: [
			{
				id: 'nav', width: '50px'
			}, {
				content: [
					{ id: 'main' },
					{ id: 'footer', height: '30px' }
				]
			}
		]
	}]
};

/*
<page>
	<head height="150px" />
	<div>
		<nav width="50px" />
		<div>
			<main />
			<footer height="30px" />
		</div>
	</div>
</page>
*/

// const l = {
// 	head: '150px',
// 	r1: {
// 		nav: '50px',
// 		c1: {
// 			main: '',
// 			footer: '30px'
// 		}
// 	}
// };

// const names = {
// 	head: l.r0,
// 	nav: l.r1.c0,
// 	main: l.r1.c1.r0,
// 	footer: l.r1.c1.r1,
// }


/*
TODO:

from the json above, output: 
	- grid-template-areas
	- grid-template-columns
	- grid-template-rows

areas:
	"head head head"
	"sep1 sep1 sep1"
	"nav sep2 main"
	"nav sep2 sep3"
	"nav sep2 foot";
columns: 50px 5px 1fr;
rows: 150px 5px 1fr 5px 30px;

seperators should be inferred
flex space should be inferred

*/

const l = {
	head: '150px',
	sep1: '5px',
	r2: {
		nav: '50px',
		sep2: '5px',
		c1: {
			main: '',
			sep3: '5px',
			foot: '30px'
		}
	}
};


function gridDims(input, which="rows"){
	const dims = {
		columns: [],
		rows: []
	};

	function _gridDims(_input, _which){
		if(typeof _input === 'string') return;

		const otherWhich = _which === 'columns' ? 'rows' : 'columns';
		const children = Object.keys(_input);
		if(!children.length){
			dims[_which] = [...dims[_which], _input];
			return;
		}

		const hasGrandChild = (x) => typeof _input[x] === 'object' &&
			Object.keys(_input[x]).find(y => typeof _input[x][y] === 'object');

		const items = children.filter(x => !hasGrandChild(x))
			.map(c => ({
				key: c,
				value: (typeof _input[c] !== 'object' || hasGrandChild(_input[c])
					? _input[c]
					: '') || '1fr'
			}))
		dims[_which] = [...dims[_which], ...items];
		// console.log(children + ' - ' + _which);
		// console.log(JSON.stringify(dims, null, 2)+'\n');

		for(var i=0, len=children.length; i<len; i++){
			const child = children[i];
			_gridDims(
				_input[child],
				otherWhich
			);
		}
	}

	_gridDims(input, which);

	return { dims };
}

function fillGrid(input, grid, dims, which="rows"){
	let currentRow = 0;
	let currentCol = 0;

	function _fillGrid(_input, _which){
		if(typeof _input === 'string') return;

		const otherWhich = _which === 'columns' ? 'rows' : 'columns';
		const children = Object.keys(_input);

		for(var i=0, len=children.length; i<len; i++){
			const child = children[i];

			if(typeof input[child] !== 'object'){
				if(_which === 'rows'){
					for(var j=currentCol, jlen=grid[i].length; j<jlen; j++){
						grid[i][j]=child;
					}
					currentRow++;
				}
				if(_which === 'columns'){
					var j=currentRow;
					var jlen=grid.length;
					for(; j<jlen; j++){
						if(typeof _input[child] === 'object'){
							Object.keys(_input[child])
								.forEach((k,l) => {
									grid[currentRow+l][currentCol] = k
								})
							continue;
						}
						grid[j][currentCol]=child;
					}
					currentCol++;
				}
				continue;
			}

			_fillGrid(
				_input[child],
				otherWhich
			);
		}
	}

	_fillGrid(input, which);

	return { dims };
}

const clone = x => JSON.parse(JSON.stringify(x));

const insertBetween = (insertee, array) => array.reduce(
	(acc, item, i, { length }) => {
		if (i && i < length) {
			return [...acc, clone(insertee), item];
		}
		return [...acc, item];
	},
	[]
);

const numberSpacers = (arr) => {
	console.log(JSON.stringify(arr, null, 2))
	let sepNumb = 1;
	return arr.reduce((acc, i) => {
		if(i.key !== 'sep') return acc;
		console.log(acc);
		i.key = i.key + acc;
		return acc+1;
	}, sepNumb)
};

const gridAreas = (_layout, dims) => {
	const rows = dims.rows
		.map(x => new Array(dims.columns.length).fill('x'));
	fillGrid(_layout, rows, dims);
	return rows.map(x => x.join(' '));
};

function getCSS(_layout){
	const { dims } = gridDims(_layout);

	// TODO: spacers need to be added in a better way
	//const sep = { key: 'sep', value: '5px' };
	//dims.columns = insertBetween(sep, dims.columns);
	//dims.rows = insertBetween(sep, dims.rows);
	//numberSpacers([...dims.rows, ...dims.columns]);

	return {
		//dims,
		'grid-template-areas': gridAreas(_layout, dims),
		'grid-template-columns': dims.columns.map(x => x.value).join(' '),
		'grid-template-rows': dims.rows.map(x => x.value).join(' ')
	}
}

export { getCSS };

const loadedAsModule = typeof window !== 'undefined';
if(!loadedAsModule){
	console.log('\n-------------------------')
	console.log(JSON.stringify(getCSS(l), null, 2));
}
