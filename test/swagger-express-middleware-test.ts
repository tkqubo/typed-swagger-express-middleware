import * as middleware from 'swagger-express-middleware';

declare const callback: (err: Error, middleware: middleware.Middleware) => void;

middleware('');

let resource = new middleware.Resource('/foo');
resource.collection;
