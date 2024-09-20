import { IncomingMessage, ServerResponse } from "http";
import { router } from "../router";

describe("Router Class", () => {
  let req: IncomingMessage;
  let res: ServerResponse;
  let mockResponseData: any[];

  beforeEach(() => {
    mockResponseData = [];
    res = {
      writeHead: jest.fn(),
      end: jest.fn((data) => {
        mockResponseData.push(data);
      }),
    } as unknown as ServerResponse;

    req = {
      url: "",
      method: "",
    } as unknown as IncomingMessage;
  });

  test("should register a route and handle requests", () => {
    const handler = jest.fn((req, res, next) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Success" }));
    });

    router.register("GET", "/test", handler);

    req.method = "GET";
    req.url = "/test";

    router.handleRequest(req.method, req.url, req, res);

    expect(handler).toHaveBeenCalled();
    expect(res.writeHead).toHaveBeenCalledWith(200, { "Content-Type": "application/json" });
    expect(mockResponseData[0]).toEqual(JSON.stringify({ message: "Success" }));
  });

  test("should return 404 for unregistered routes", () => {
    req.method = "GET";
    req.url = "/notfound";

    router.handleRequest(req.method, req.url, req, res);

    expect(res.writeHead).toHaveBeenCalledWith(404, { "Content-Type": "application/json" });
    expect(mockResponseData[0]).toEqual(JSON.stringify({ error: "Not Found" }));
  });

  test("should handle route parameters", () => {
    const handler = jest.fn((req, res, next) => {
      const { params } = req as any;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ id: params.id }));
    });

    router.register("GET", "/user/:id", handler);

    req.method = "GET";
    req.url = "/user/123";

    router.handleRequest(req.method, req.url, req, res);

    expect(handler).toHaveBeenCalled();
    expect(res.writeHead).toHaveBeenCalledWith(200, { "Content-Type": "application/json" });
    expect(mockResponseData[0]).toEqual(JSON.stringify({ id: "123" }));
  });

  test("should return 500 for handler errors", () => {
    const handler = jest.fn(() => {
      throw new Error("Handler error");
    });

    router.register("GET", "/error", handler);

    req.method = "GET";
    req.url = "/error";

    router.handleRequest(req.method, req.url, req, res);

    expect(res.writeHead).toHaveBeenCalledWith(500, { "Content-Type": "application/json" });
    expect(mockResponseData[0]).toEqual(JSON.stringify({ error: "Internal Server Error" }));
  });
});