const seqDiagram = `
sequenceDiagram
	title: An Example Sequence Diagram


	participant mobile as Mobile
	participant auth as Auth0
	participant api as API
	participant db as DB

	mobile->>auth: Login
	activate auth
	auth-->>mobile: UserInfo
	deactivate auth

	note left of mobile:check
	mobile ->> api : MobileHasActiveSubscription
	activate api
	api->>db: schema.graphql:cypher
	db-->>api: keeper.active, receipt.active, r.type=subscription, expiration > r.expire
	api-->>mobile: boolean
	deactivate api

`;

//console.log(mermaid)


mermaid.initialize({
	theme: 'dark', 
	//themeCSS: '.node rect { fill: red; }',
	logLevel: 3,
	securityLevel: 'loose',
	startOnLoad: false,
	//flowchart: { curve: 'basis' },
	//gantt: { axisFormat: '%m/%d/%Y' },
	//sequence: { actorMargin: 50 },
});

mermaid.render('drawing', seqDiagram, function(svgCode) {
	document.body.innerHTML = svgCode;
});
