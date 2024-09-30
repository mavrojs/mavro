"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./core");
function exempleMiddleware(req, res, next) {
    console.warn("Passing from middleware");
    next();
}
core_1.router.get('/', (req, res) => {
    res.json({
        message: 'welcome to this world'
    });
});
core_1.app.listen();
