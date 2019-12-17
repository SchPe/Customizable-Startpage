const okBtn = document.createElement("button");
okBtn.id = "Ok";
const subreddit = document.createElement("input");
subreddit.id = "subreddit";
const redditEntries = document.createElement("input");
redditEntries.id = "redditEntries";
const tab = document.createElement("div");
tab.className += " tab-pane active";
tab.id = "reddit";
redditEntries.value = "13";
subreddit.value = "r/programming";

document.body.append(subreddit);
document.body.append(redditEntries);
document.body.append(tab);
document.body.append(okBtn);

import events from "../src/js/util/events.js";
import eventTypes from "../src/js/util/eventTypes.js";
import RedditQueryViewMocked from "../src/js/reddit/redditQueryView.js";
const RedditQueryView = jest.requireActual(
  "../src/js/reddit/redditQueryView.js"
).default;
import RedditControllerMock from "../src/js/reddit/redditController.js";
const RedditController = jest.requireActual(
  "../src/js/reddit/redditController.js"
).default;
import RedditView from "../src/js/reddit/redditView.js";

import MainController from "../src/js/main/mainController.js";
import DesktopMainViewMock from "../src/js/main/desktopMainView.js";
const DesktopMainView = jest.requireActual("../src/js/main/desktopMainView.js")
  .default;

// import CacheControllerMock from "../src/js/main/cacheController.js";
const CacheController = jest.requireActual("../src/js/main/cacheController.js")
  .default;

jest.mock("../src/js/reddit/redditQueryView.js");
jest.mock("../src/js/reddit/redditController.js");

jest.mock("../src/js/main/desktopMainView.js");
// jest.mock("../src/js/main/cacheController.js");

jest.mock("../src/js/main/serviceWorker.js");

jest.spyOn(events, "publish");

$.fn.inputSpinner = jest.fn();
$.fn.selectpicker = jest.fn();

describe.only("reddit Test:", () => {
  beforeEach(() => {
    events.clear();
  });

  test("RedditController validates correctly", () => {
    const redditController = new RedditController();
    const content = document.createElement("div");
    const redditQueryView = new RedditQueryViewMocked(content);

    redditController.validate({
      view: redditQueryView,
      query: {
        subreddit: "blub",
        limit: 42
      }
    });

    redditController.validate({
      view: redditQueryView,
      query: {
        subreddit: "r/environment",
        limit: "s"
      }
    });

    redditController.validate({
      view: redditQueryView,
      query: { subreddit: "", limit: 42 }
    });

    redditController.validate({
      view: redditQueryView,
      query: {
        subreddit: "r/programming",
        limit: 42
      }
    });

    expect(redditQueryView.showInputAsInvalid).toHaveBeenCalledTimes(2);
    expect(redditQueryView.unShowInputAsInvalid).toHaveBeenCalledTimes(4);
  });

  var message;

  const redditQueryView = new RedditQueryView(okBtn);

  test("RedditQueryView on clicking button fires validationRequired Event", () => {
    events.subscribe(eventTypes.validationRequired, e => (message = e));

    $(okBtn).click();

    expect(events.publish).toHaveBeenCalledTimes(3);
    expect(events.publish.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Symbol(newViewRequired),
        Object {
          "query": Object {
            "limit": 42,
            "subreddit": "",
          },
          "view": RedditQueryView {
            "createQuery": [MockFunction],
            "onValidationRequired": [MockFunction],
            "showInputAsInvalid": [MockFunction] {
              "calls": Array [
                Array [
                  "wrong subreddit input",
                ],
                Array [
                  "wrong counter input",
                ],
              ],
              "results": Array [
                Object {
                  "type": "return",
                  "value": undefined,
                },
                Object {
                  "type": "return",
                  "value": undefined,
                },
              ],
            },
            "unShowInputAsInvalid": [MockFunction] {
              "calls": Array [
                Array [],
                Array [],
                Array [],
                Array [],
              ],
              "results": Array [
                Object {
                  "type": "return",
                  "value": undefined,
                },
                Object {
                  "type": "return",
                  "value": undefined,
                },
                Object {
                  "type": "return",
                  "value": undefined,
                },
                Object {
                  "type": "return",
                  "value": undefined,
                },
              ],
            },
          },
        },
      ]
    `);

    expect(message.query.subreddit).toEqual("r/programming");
  });

  test("redditController on validationRequired event and then successful validation fired newView required event", () => {
    const mainViewMock = new DesktopMainViewMock();
    const mainController = new MainController(mainViewMock);

    mainController.redditController = new RedditControllerMock();

    jest.spyOn(mainController, "onValidationRequired");

    mainController.redditController.validate.mockReturnValueOnce(true);

    events.publish(eventTypes.validationRequired, message);

    expect(events.publish).toHaveBeenCalledTimes(4);
    expect(events.publish.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Symbol(newViewRequired),
        Object {
          "query": Object {
            "limit": 42,
            "subreddit": "",
          },
          "view": RedditQueryView {
            "createQuery": [MockFunction],
            "onValidationRequired": [MockFunction],
            "showInputAsInvalid": [MockFunction] {
              "calls": Array [
                Array [
                  "wrong subreddit input",
                ],
                Array [
                  "wrong counter input",
                ],
              ],
              "results": Array [
                Object {
                  "type": "return",
                  "value": undefined,
                },
                Object {
                  "type": "return",
                  "value": undefined,
                },
              ],
            },
            "unShowInputAsInvalid": [MockFunction] {
              "calls": Array [
                Array [],
                Array [],
                Array [],
                Array [],
              ],
              "results": Array [
                Object {
                  "type": "return",
                  "value": undefined,
                },
                Object {
                  "type": "return",
                  "value": undefined,
                },
                Object {
                  "type": "return",
                  "value": undefined,
                },
                Object {
                  "type": "return",
                  "value": undefined,
                },
              ],
            },
          },
        },
      ]
    `);
  });

  test("MainView upon being called with createNewView fires publishes message with new Event and Query", () => {
    const mainView = new DesktopMainView();
    events.subscribe(eventTypes.newView, e => (message = e));

    mainView.createNewView(message);
    expect(message).toMatchInlineSnapshot(
      {
        view: { id: expect.any(String), mainDomElement: expect.anything() },
        element: expect.anything(),
        query: {
          limit: "13",
          subreddit: "r/programming",
          type: "reddit"
        }
      },
      `
      Object {
        "element": Anything,
        "query": Object {
          "limit": "13",
          "subreddit": "r/programming",
          "type": "reddit",
        },
        "view": Object {
          "id": Any<String>,
          "mainDomElement": Anything,
        },
      }
    `
    );
  });

  // test("MainController on newView event calls redditController.showContent", () => {
  //   const mainViewMock = new DesktopMainViewMock();
  //   const mainController = new MainController(mainViewMock);
  //   mainController.redditController = new RedditControllerMock();

  //   events.publish(eventTypes.newView, message);

  //   expect(mainController.redditController.showContent).lastCalledWith(
  //     message.view,
  //     message.query
  //   );
  // });

  // test("RedditController gets valid data from Model.getContent and calls View.showContent with it", async () => {
  //   const element = document.createElement("div");
  //   element.id = "123";
  //   element.innerHTML = `<div><div><div></div></div></div><div></div><div></div>`;

  //   const redditController = new RedditController();
  //   const view = new RedditView(element);

  //   jest.spyOn(view, "showContent");

  //   jest.setTimeout(60000);

  //   await redditController.showContent(view, message.query);

  //   expect(view.showContent.mock.calls[0][0]).toMatchInlineSnapshot(``);
  //   // expect(view.showContent.mock.calls[0][0]).toMatchInlineSnapshot(
  //   //   { data: expect.anything(), kind: "Listing" },
  //   //   `
  //   //   Object {
  //   //     "data": Anything,
  //   //     "kind": "Listing",
  //   //   }
  //   // `
  //   // );
  // });

  test("CacheController writes into and deletes cache properly", () => {
    const cacheController = new CacheController("desktop");

    message.view.getMainDomElement().id = "123";
    message.view.id = "123";
    events.publish(eventTypes.newView, message);

    var cards = cacheController.getCacheData().cards;
    var data;
    for (const id in cards) data = cards[id];

    expect(data).toMatchInlineSnapshot(`
      Object {
        "content": Object {
          "limit": "13",
          "subreddit": "r/programming",
          "type": "reddit",
        },
        "desktop": Object {
          "dimension": Object {
            "height": 0,
            "width": 0,
          },
          "position": Object {
            "left": 0,
            "top": 0,
          },
          "zIndex": "0",
        },
      }
    `);

    cacheController.attachView(message.view);
    events.publish(
      eventTypes.viewClosed + message.view.id,
      message.view.getMainDomElement()
    );

    cards = cacheController.getCacheData().cards;
    for (const id in cards) data = cards[id];

    expect(data).toMatchInlineSnapshot(`
      Object {
        "content": Object {
          "limit": "13",
          "subreddit": "r/programming",
          "type": "reddit",
        },
        "desktop": Object {
          "dimension": Object {
            "height": 0,
            "width": 0,
          },
          "position": Object {
            "left": 0,
            "top": 0,
          },
          "zIndex": "0",
        },
      }
    `);
  });
});
