import { app, logger, Console, statusCodes } from "../";
import { Request, Response, Next, Middleware } from "../types";
import { randomUUID } from "crypto";

describe("App Class", () => {
  it("Registers and handles a GET route.", async () => {
    app.get("/", (req, res) => {
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
    } finally {
      app.close();
    }
  });
  it("Registers and handles a GET :uuid route.", async () => {
    const uuid = randomUUID();

    app.get("/:uuid", (req, res) => {
      const reqUUID = req.params.uuid;
      res.json({ ...statusCodes[200], uuid: reqUUID });
    });

    app.listen(1337);

    try {
      const response = await fetch("http://localhost:1337/" + uuid, {
        method: "GET",
      });
      const result = await response.json();
      expect(result.uuid).toBe(uuid);
      expect(result.code).toBe(200);
    } catch (error) {
      throw new Error(`Test failed with error: ${error}`);
    } finally {
      app.close();
    }
  });
  it("Registers and handles a POST route.", async () => {
    app.post("/", (req, res) => {
      res.json({ ...statusCodes[200] });
    });

    app.listen(1337);

    try {
      const response = await fetch("http://localhost:1337/", {
        method: "POST",
      });
      const result = await response.json();
      expect(response.status).toBe(200);
      expect(result.code).toBe(200);
    } catch (error) {
      throw new Error(`Test failed with error: ${error}`);
    } finally {
      app.close();
    }
  });
  it("Registers and handles a PUT route.", async () => {
    app.put("/", (req, res) => {
      res.json({ ...statusCodes[200] });
    });

    app.listen(1337);

    try {
      const response = await fetch("http://localhost:1337/", {
        method: "PUT",
      });
      const result = await response.json();
      expect(response.status).toBe(200);
      expect(result.code).toBe(200);
    } catch (error) {
      throw new Error(`Test failed with error: ${error}`);
    } finally {
      app.close();
    }
  });
  it("Registers and handles a DELETE route.", async () => {
    app.delete("/", (req, res) => {
      res.json({ ...statusCodes[200] });
    });

    app.listen(1337);

    try {
      const response = await fetch("http://localhost:1337/", {
        method: "DELETE",
      });
      const result = await response.json();
      expect(response.status).toBe(200);
      expect(result.code).toBe(200);
    } catch (error) {
      throw new Error(`Test failed with error: ${error}`);
    } finally {
      app.close();
    }
  });
  it("Handles 404 when no route matches.", async () => {
    app.get("/", (req, res) => {
      res.json({ ...statusCodes[200] });
    });

    app.listen(1337);

    try {
      const response = await fetch("http://localhost:1337/users", {
        method: "GET",
      });
      const result = await response.json();
      expect(response.status).toBe(200);
      expect(result.code).toBe(200);
    } catch (error) {
      throw new Error(`Test failed with error: ${error}`);
    } finally {
      app.close();
    }
  });
  it("should log incoming requests and response status.", async () => {
    // Spy on the Console to capture logs
    const consoleSpy = jest.spyOn(Console, 'status').mockImplementation(() => {});
  
    // Create a simple route
    app.get("/", (req, res) => {
      res.json({ message: "Test route" });
    });
  
    app.listen(1337);
  
    try {
      const response = await fetch("http://localhost:1337/", {
        method: "GET",
      });
      const result = await response.json();
  
      // Check if the status and the message are correct
      expect(response.status).toBe(200);
  
      // Ensure the logger was called with the correct status and request method
      expect(consoleSpy).toHaveBeenCalledWith(200, "GET / 200 - 0ms");
    } finally {
      // Close the app after the test
      app.close();
      consoleSpy.mockRestore(); // Restore the original Console method
    }
  });
});
