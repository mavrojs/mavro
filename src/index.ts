import { app, router } from './core';
import { Middleware, Request, Response, Route } from './core/types';

const simpleMiddleware:Middleware = (req:Request, res:Response, next:()=>void) =>{
  console.log(req);
  next();
}

const simpleRoute = router.register('GET', '/', simpleMiddleware);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
