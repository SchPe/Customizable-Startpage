const okBtn = document.createElement("button");
okBtn.id = "Ok";
const repositoryAndOwner = document.createElement("input");
repositoryAndOwner.id = "repository";
const tab = document.createElement("div");
tab.className += " tab-pane active";
tab.id = "github";
repositoryAndOwner.value = "https://github.com/huggingface/transformers";

document.body.append(repositoryAndOwner);
document.body.append(tab);
document.body.append(okBtn);

import events from "../src/js/util/events.js";
import eventTypes from "../src/js/util/eventTypes.js";

import GithubQueryViewMocked from "../src/js/github/githubQueryView.js";

import GithubControllerMock from "../src/js/github/githubController.js";
const GithubController = jest.requireActual(
  "../src/js/github/githubController.js"
).default;
import GithubView from "../src/js/github/githubView.js";

import MainController from "../src/js/main/mainController.js";
import DesktopMainViewMock from "../src/js/main/desktopMainView.js";
const DesktopMainView = jest.requireActual("../src/js/main/desktopMainView.js")
  .default;

// import CacheControllerMock from "../src/js/main/cacheController.js";
const CacheController = jest.requireActual("../src/js/main/cacheController.js")
  .default;

jest.mock("../src/js/github/githubQueryView.js");
jest.mock("../src/js/github/githubController.js");
jest.mock("../src/js/main/serviceWorker.js");

jest.mock("../src/js/main/desktopMainView.js");
// jest.mock("../src/js/main/cacheController.js");

jest.spyOn(events, "publish");

$.fn.inputSpinner = jest.fn();
$.fn.selectpicker = jest.fn();

describe("github Test:", () => {
  beforeEach(() => {
    events.clear();
  });

  test("GithubController validates correctly", () => {
    const githubController = new GithubController();
    const content = document.createElement("div");
    const githubQueryView = new GithubQueryViewMocked(content);

    githubController.validate({
      view: githubQueryView,
      query: { repositoryAndOwner: "balks" }
    });

    githubController.validate({
      view: githubQueryView,
      query: {
        repositoryAndOwner: "https://github.com/huggingface/transformers"
      }
    });

    githubController.validate({
      view: githubQueryView,
      query: { repositoryAndOwner: "" }
    });

    expect(githubQueryView.showInputAsInvalid).toHaveBeenCalledTimes(1);
    expect(githubQueryView.unShowInputAsInvalid).toHaveBeenCalledTimes(3);
  });

  var message;

  // while(!document.getElementById('repository')){}

  const GithubQueryView = jest.requireActual(
    "../src/js/github/githubQueryView.js"
  ).default;

  const githubQueryView = new GithubQueryView(okBtn);

  test("GithubQueryView on clicking button fires validationRequired Event", () => {
    events.subscribe(eventTypes.validationRequired, e => (message = e));

    $(okBtn).click();

    expect(events.publish).toHaveBeenCalledTimes(3);
    expect(events.publish.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Symbol(newViewRequired),
        Object {
          "query": Object {
            "owner": "huggingface",
            "repo": "transformers",
            "repositoryAndOwner": "https://github.com/huggingface/transformers",
          },
          "view": GithubQueryView {
            "createQuery": [MockFunction],
            "onValidationRequired": [MockFunction],
            "showInputAsInvalid": [MockFunction] {
              "calls": Array [
                Array [],
              ],
              "results": Array [
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
              ],
            },
          },
        },
      ]
    `);

    expect(message.query.repositoryAndOwner).toEqual(
      "https://github.com/huggingface/transformers"
    );
  });

  test("githubController on validationRequired event and then successful validation fired newView required event", () => {
    const mainViewMock = new DesktopMainViewMock();
    const mainController = new MainController(mainViewMock);

    mainController.githubController = new GithubControllerMock();

    jest.spyOn(mainController, "onValidationRequired");

    mainController.githubController.validate.mockReturnValueOnce(true);

    events.publish(eventTypes.validationRequired, message);

    expect(mainController.onValidationRequired).lastCalledWith(message);
    // expect(mainViewMock.createNewView).lastCalledWith(message);
    expect(events.publish).toHaveBeenCalledTimes(4);
    expect(events.publish.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Symbol(newViewRequired),
        Object {
          "query": Object {
            "owner": "huggingface",
            "repo": "transformers",
            "repositoryAndOwner": "https://github.com/huggingface/transformers",
          },
          "view": GithubQueryView {
            "createQuery": [MockFunction],
            "onValidationRequired": [MockFunction],
            "showInputAsInvalid": [MockFunction] {
              "calls": Array [
                Array [],
              ],
              "results": Array [
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
          repositoryAndOwner: "https://github.com/huggingface/transformers",
          type: "github"
        }
      },
      `
      Object {
        "element": Anything,
        "query": Object {
          "repositoryAndOwner": "https://github.com/huggingface/transformers",
          "type": "github",
        },
        "view": Object {
          "id": Any<String>,
          "mainDomElement": Anything,
        },
      }
    `
    );
  });

  // test("MainController on newView event calls githubController.showContent", () => {
  //   const mainViewMock = new DesktopMainViewMock();
  //   const mainController = new MainController(mainViewMock);

  //   events.publish(eventTypes.newView, message);

  //   expect(mainController.controllerMap.get('github').showContent).lastCalledWith(
  //     message.view,
  //     message.query
  //   );
  // });

  //   test("GithubController gets valid data from Model.getContent and calls View.showContent with it", async () => {
  //     const element = document.createElement("div");
  //     element.id = "123";
  //     element.innerHTML = `<div><div><div></div></div></div><div></div><div></div>`;

  //     const githubController = new GithubController();
  //     const view = new GithubView(element);

  //     jest.spyOn(view, "showContent");

  //     jest.setTimeout(60000);

  //     await githubController.showContent(view, message.query);

  //     expect(view.showContent.mock.calls[0][0]).toMatchInlineSnapshot(
  //       { data: expect.anything(), kind: "Listing" },
  //       `
  //       Object {
  //         "data": Anything,
  //         "kind": "Listing",
  //       }
  //     `
  //     );
  //   });

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
          "repositoryAndOwner": "https://github.com/huggingface/transformers",
          "type": "github",
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
    // expect(cacheController.getCacheData()).toMatchInlineSnapshot(
    //   {
    //     "cards": {
    //       expect.any(String): {
    //         "content": {
    //           "repositoryAndOwner": "https://github.com/huggingface/transformers",
    //           "type": "github",
    //         },
    //         "desktop": {
    //           "dimension": {
    //             "height": 0,
    //             "width": 0,
    //           },
    //           "position": {
    //             "left": 0,
    //             "top": 0,
    //           },
    //           "zIndex": "0",
    //         },
    //       },
    //       "default": {
    //         "content":  {
    //           "type": "default",
    //         },
    //       },
    //     },
    //     "idToken": 0,
    //     "timeStamp": expect.anything(),
    //   }
    // );

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
          "repositoryAndOwner": "https://github.com/huggingface/transformers",
          "type": "github",
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
