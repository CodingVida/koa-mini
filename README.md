# koa-mini

## Application

## Context

## Middleware
难点在于洋葱模型的理解，以及各个中间件的组合使用。
在执行上使用一个递归函数，将下一个中间件作为参数传入 `next` 中。

递归函数定义如下：
```javascript
const dispatch = (i) => {
	if (i === middlewares.length) {
		return ;
	}

	const middleware = middlewares[i];
	return middleware(ctx, () => dispatch(i + 1));
}
```

完整的组合方法为：
```javascript
function compose (middlewares) {
	return (ctx) => {
		const dispatch = (i) => {
			if (i === middlewares.length) {
				return ;
			}

			const middleware = middlewares[i];
			return middleware(ctx, () => dispatch(i + 1));
		}
		return dispatch(0);
	}
}

```