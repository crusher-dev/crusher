const express = require('express');
const next = require('next');
const proxy = require('express-http-proxy');
const port = parseInt(process.env.PORT, 10) || 9000;
const dev = process.env.NODE_ENV === 'development';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	const server = express();

	server.all('*', (req, res) => {
		return handle(req, res);
	});

	server.use('/server', proxy('localhost:9000'));

	const serverInstance = server.listen(port, err => {
		if (err) throw err;
		//eslint-disable-next-line
		console.log(`> Ready on http://localhost:${port}`);
	});


});