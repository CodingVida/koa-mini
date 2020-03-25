const http = require('http');

function compose (middlewares) {
	return (ctx) => {
		const dispatch = (i) => {
			if (i === middlewares.length) {
				return;
			}
			const middleware = middlewares[i];
			return middleware(ctx, () => dispatch(i + 1));
		}

		return dispatch(0);
	}
}

export default class Application {
	constructor () {
		this.middleware = [];
	}

	listen (...args) {
		const server = http.createServer(async (req, res) => {
			const ctx = new Context(req, res);
			const fn = compose(this.middleware);

			try {
				await fn(ctx);
			} catch (e) {
				ctx.res.statusCode = 500;
				ctx.res.end('Internel Server Error');
			}

			ctx.res.end(ctx.body);
		});

		server.listen(...args);
	}

	use (middleware) {
		this.middleware.push(middleware);
	}
}

class Context {
	constructor (req, res) {
		this.req = req;
		this.res = res;
	}
}

// example

// const app = new Application();

// app.use(async (ctx, next) => {
// 	console.log('middleware1 start');
// 	await next();
// 	console.log('middleware1 end');
// });

// app.use(async (ctx, next) => {
// 	console.log('middleware2 start');
// 	await next();
// 	console.log('middleware2 end');

// 	ctx.body = 'hello world';
// });

// app.listen(7000)