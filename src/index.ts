import { app, router, debug, logger } from "./core";
import { Next, Request, Response } from "./core/types";

function exempleMiddleware(req:Request, res:Response, next:Next){
    console.warn("Passing from middleware");
    next();
}


router.get('/', (req:Request, res:Response)=>{
    res.json({
      message: 'welcome to this world'  
    })
});

app.listen();