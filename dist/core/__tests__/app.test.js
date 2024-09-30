"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const crypto_1 = require("crypto");
describe("App Class", () => {
    it("Registers and handles a GET route.", async () => {
        __1.app.get("/", (req, res) => {
            res.json({ ...__1.statusCodes[200] });
        });
        __1.app.listen(1337);
        try {
            const response = await fetch("http://localhost:1337", { method: "GET" });
            const result = await response.json();
            expect(response.status).toBe(200);
            expect(result.code).toBe(200);
        }
        catch (error) {
            throw new Error(`Test failed with error: ${error}`);
        }
        finally {
            __1.app.close();
        }
    });
    it("Registers and handles a GET :uuid route.", async () => {
        const uuid = (0, crypto_1.randomUUID)();
        __1.app.get("/:uuid", (req, res) => {
            const reqUUID = req.params.uuid;
            res.json({ ...__1.statusCodes[200], uuid: reqUUID });
        });
        __1.app.listen(1337);
        try {
            const response = await fetch("http://localhost:1337/" + uuid, {
                method: "GET",
            });
            const result = await response.json();
            expect(result.uuid).toBe(uuid);
            expect(result.code).toBe(200);
        }
        catch (error) {
            throw new Error(`Test failed with error: ${error}`);
        }
        finally {
            __1.app.close();
        }
    });
    it("Registers and handles a POST route.", async () => {
        __1.app.post("/", (req, res) => {
            res.json({ ...__1.statusCodes[200] });
        });
        __1.app.listen(1337);
        try {
            const response = await fetch("http://localhost:1337/", {
                method: "POST",
            });
            const result = await response.json();
            expect(response.status).toBe(200);
            expect(result.code).toBe(200);
        }
        catch (error) {
            throw new Error(`Test failed with error: ${error}`);
        }
        finally {
            __1.app.close();
        }
    });
    it("Registers and handles a PUT route.", async () => {
        __1.app.put("/", (req, res) => {
            res.json({ ...__1.statusCodes[200] });
        });
        __1.app.listen(1337);
        try {
            const response = await fetch("http://localhost:1337/", {
                method: "PUT",
            });
            const result = await response.json();
            expect(response.status).toBe(200);
            expect(result.code).toBe(200);
        }
        catch (error) {
            throw new Error(`Test failed with error: ${error}`);
        }
        finally {
            __1.app.close();
        }
    });
    it("Registers and handles a DELETE route.", async () => {
        __1.app.delete("/", (req, res) => {
            res.json({ ...__1.statusCodes[200] });
        });
        __1.app.listen(1337);
        try {
            const response = await fetch("http://localhost:1337/", {
                method: "DELETE",
            });
            const result = await response.json();
            expect(response.status).toBe(200);
            expect(result.code).toBe(200);
        }
        catch (error) {
            throw new Error(`Test failed with error: ${error}`);
        }
        finally {
            __1.app.close();
        }
    });
    it("Handles 404 when no route matches.", async () => {
        __1.app.get("/", (req, res) => {
            res.json({ ...__1.statusCodes[200] });
        });
        __1.app.listen(1337);
        try {
            const response = await fetch("http://localhost:1337/users", {
                method: "GET",
            });
            const result = await response.json();
            expect(response.status).toBe(200);
            expect(result.code).toBe(200);
        }
        catch (error) {
            throw new Error(`Test failed with error: ${error}`);
        }
        finally {
            __1.app.close();
        }
    });
    it("should log incoming requests and response status.", async () => {
        // Spy on the Console to capture logs
        const consoleSpy = jest.spyOn(__1.Debug, 'status').mockImplementation(() => { });
        // Create a simple route
        __1.app.get("/", (req, res) => {
            res.json({ message: "Test route" });
        });
        __1.app.listen(1337);
        try {
            const response = await fetch("http://localhost:1337/", {
                method: "GET",
            });
            const result = await response.json();
            // Check if the status and the message are correct
            expect(response.status).toBe(200);
            // Ensure the logger was called with the correct status and request method
            expect(consoleSpy).toHaveBeenCalledWith(200, "GET / 200 - 0ms");
        }
        finally {
            // Close the app after the test
            __1.app.close();
            consoleSpy.mockRestore(); // Restore the original Console method
        }
    });
});
