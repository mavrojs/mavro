import { app, logger, Console, statusCodes } from "../";
import { Request, Response, Next, Middleware } from "../types";


describe("App Class", () => {
  it("Registers and handles a GET route.", async () => {
    app.get('/', (req, res) => {
        res.json({ ...statusCodes[200] });
    });

    app.listen(1337);

    try {
        const response = await fetch("http://localhost:1337", { method: "GET" });
        const result = await response.json(); 
        expect(response.status).toBe(200);
        expect(result.code).toBe(200);
    } catch (error) {
        throw new Error(`Test failed with error: ${error}`);
    }
    finally{
      app.close();
    }
});
  it("Registers and handles a GET :uuid route.", ()=>{
    
  });
  it("Registers and handles a POST route.", ()=>{
    
  });
  it("Registers and handles a PUT route.", ()=>{
    
  });
  it("Registers and handles a DELETE route.", ()=>{
    
  });
  it("Handles 404 when no route matches.", ()=>{

  });
  it("Handles internal server errors.", ()=>{

  });
  it("Handles internal server errors.", ()=>{

  });
  it("should logs incoming requests and response status.", ()=>{

  });
});