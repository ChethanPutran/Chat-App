//Testing functions
const expectExport = require("expect");
var generateMessage = require("../server/modals/msg");

test("message check", () => {
  const from = "Rock";
  const message = "Hi Guys";
  const to = "Me";
  var msg = generateMessage(from, message, to);
  expect(msg.from).toBe("Rock");
  expect(msg.message).toBe("Hi Guys");
});

//Testing async functions

test("Async func test", (done) => {
  setTimeout(() => {
    expect(1).toBe(1);
    done();
  }, 3000);
});
