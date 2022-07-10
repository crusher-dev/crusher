import EntryPoint from "../../src/commands/index";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createTempGitRepo, createTempCrusherGlobalDir } from "../utils";
import fs from "fs";
import cli from "cli-ux";
import { resolve } from "path";

var mock = new MockAdapter(axios, { onNoMatch: "passthrough" });
jest.setTimeout(15000);
describe("Test create command", () => {
  let stdout, stderr, mockExit, lastTempPath, globalAppDir;

  beforeAll(() => {
    globalAppDir = createTempCrusherGlobalDir();
    process.env.CRUSHER_GLOBAL_DIR = globalAppDir;
  });

  afterAll(() => {
    fs.rmdirSync(globalAppDir, { recursive: true });
  });

  beforeEach(() => {
    stdout = [];
    stderr = [];
    jest.spyOn(console, "log").mockImplementation((...val) => {
      stdout.push("\n");
      stdout.push(...val);
    });
    jest.spyOn(cli, "open").mockImplementation(() => {
      return Promise.resolve(true);
    });

    jest.spyOn(cli.action, "stop").mockImplementation((...val) => {
      stdout.push("\n");
      stdout.push(val[0] || "done");
    });

    jest.spyOn(cli.action, "start").mockImplementation((...val) => {
      stdout.push("\n");
      stdout.push(...val);
    });

    jest.spyOn(console, "error").mockImplementation((...val) => {
      stderr.push("\n");
      stderr.push(...val);
    });

    lastTempPath = createTempGitRepo();

    mockExit = jest.spyOn(process, "exit").mockImplementation((number) => {
      throw new Error("process.exit: " + number);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    if (lastTempPath) {
      fs.rmSync(lastTempPath, { recursive: true });
    }
  });

  it("should throw error if not logged in", async () => {
    mock
      .onGet("http://localhost:8000/cli/get.key")
      .reply(200, { loginKey: "xyzyzyzyzyzy" });
    mock
      .onGet("http://localhost:8000/cli/status.key?loginKey=xyzyzyzyzyzy")
      .reply(200, {
        status: "Validated",
        userToken: "blablablabla",
      });

    try {
      process.argv[2] = "test:create";
      await new EntryPoint().run();
    } catch (ex) {
      stderr.push(ex.message);
    }

    expect(stdout.join(" ")).toContain("Invalid user authentication");
  });

  it("should request user info", async () => {
    mock
      .onGet("https://backend.crusher.dev/users/actions/getUserAndSystemInfo")
      .reply(200, {
        userId: "275",
        isUserLoggedIn: true,
        userData: {
          userId: "275",
          name: "asTest",
          email: "test@test.com",
          uuid: null,
          avatar: null,
          meta: {
            INITIAL_ONBOARDING: true,
            "appState.SELECTED_PROJECT_ID": 624,
            VIEW_REPORT: true,
            RAN_TEST: true,
            TEST_CREATED: true,
          },
        },
        team: {
          id: 212,
          uuid: null,
          name: "asTest's Workspace",
          meta: {},
          plan: "FREE",
        },
        projects: [
          {
            id: 910,
            name: "CLI",
            teamId: 212,
            createdAt: "2022-02-04T20:38:53.840Z",
            updatedAt: "2022-02-08T19:15:39.292Z",
            baselineJobId: 14786,
            meta: {},
            visualBaseline: "5",
          },
          {
            id: 721,
            name: "Nov 14 test",
            teamId: 212,
            createdAt: "2021-11-13T21:07:21.000Z",
            updatedAt: "2021-11-13T22:36:15.000Z",
            baselineJobId: 12656,
            meta: { RAN_TEST: true, TEST_CREATED: true, VIEW_REPORT: true },
            visualBaseline: "5",
          },
          {
            id: 522,
            name: "Test",
            teamId: 212,
            createdAt: "2021-10-19T09:56:06.000Z",
            updatedAt: "2022-01-26T12:03:13.939Z",
            baselineJobId: 77,
            meta: {
              RAN_TEST: true,
              TEST_CREATED: true,
              INTEGRATE_WITH_CI: true,
              VIEW_REPORT: true,
            },
            visualBaseline: "5",
          },
          {
            id: 251,
            name: "Default",
            teamId: 212,
            createdAt: "2021-09-09T21:00:17.000Z",
            updatedAt: "2022-02-03T10:01:54.018Z",
            baselineJobId: 10559,
            meta: {
              INTEGRATE_WITH_CI: true,
              VIEW_REPORT: true,
              RAN_TEST: true,
              TEST_CREATED: true,
            },
            visualBaseline: "5",
          },
          {
            id: 624,
            name: "Arpit",
            teamId: 212,
            createdAt: "2021-11-02T23:00:37.000Z",
            updatedAt: "2022-02-16T03:32:35.570Z",
            baselineJobId: 12286,
            meta: {
              RAN_TEST: true,
              TEST_CREATED: true,
              VIEW_REPORT: true,
              INTEGRATE_WITH_CI: true,
            },
            visualBaseline: "5",
          },
        ],
        crusherMode: "enterprise",
        hostingType: "cloud",
        system: {
          REDIS_OPERATION: { working: true, message: null },
          MYSQL_OPERATION: { working: true, message: null },
        },
      });
    const { data } = await axios.get(
      "https://backend.crusher.dev/users/actions/getUserAndSystemInfo"
    );
    expect(data.userData.name).toEqual("asTest");
  });
});
