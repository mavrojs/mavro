import { strict as assert } from 'assert';
import { Router } from '../router';

const mockMiddleware = (req: any, res: any, next: () => void) => {
  res.mockResponse = "success";
  next();
};

const router = new Router();

router.register("GET", "/test", mockMiddleware);

const req = {
  params: {},
  query: {},
  body: {},
  headers: {},
};

const res = {
  statusCode: 200,
  mockResponse: "",
  status: function (code: number) {
    this.statusCode = code;
    return this;
  },
  send: function (body: any) {
    this.mockResponse = body;
  },
  json: function (body: any) {
    this.mockResponse = body;
  },
};

describe("Router", function() {
  it("should handle GET requests", function(done) {
    router.handleRequest("GET", "/test", req, res);
    assert.equal(res.mockResponse, "success");
    assert.equal(res.statusCode, 200);
    done();
  });

  it("should return 404 for non-existent routes", function(done) {
    router.handleRequest("GET", "/non-existent", req, res);
    assert.equal(res.statusCode, 404);
    assert.deepEqual(JSON.parse(res.mockResponse), { error: "Not Found" });
    done();
  });
});