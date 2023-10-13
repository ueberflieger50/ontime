import { google, sheets_v4, drive_v3 } from 'googleapis';
// import { parseExcel } from './parser.js';
import { getAppDataPath } from '../setup.js';
import { authenticate } from '@google-cloud/local-auth';
import { writeFile, readFile } from 'fs/promises';
import { join, resolve } from 'path';

import { LogOrigin, OntimeEvent } from 'ontime-types';
import { logger } from '../classes/Logger.js';
import { error } from 'console';
// import { eventTimer } from '../services/TimerService.js';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
];
const TOKEN_PATH = join(getAppDataPath(), 'token.json');
const CREDENTIALS_PATH = join(getAppDataPath(), 'credentials.json');
const SHEET_ID = '1oGGEg3vBPlQTf5EOTHFHjU7x7aujSXeaXk650ti-Hds';

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = (await readFile(TOKEN_PATH)).toString();
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = (await readFile(CREDENTIALS_PATH)).toString();
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let savedclient = await loadSavedCredentialsIfExist();
  if (savedclient) {
    return savedclient;
  }
  let client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

let auth;
let sheets: sheets_v4.Sheets;
let drive: drive_v3.Drive;

//TODO: magic value
const offset = 15;

export async function loadSheet() {
  auth = await authorize();
  sheets = await google.sheets({ version: 'v4', auth });
  drive = await google.drive({ version: 'v3', auth });
  // getChanges();
  // listMajors(auth).catch(console.error);
}

export async function getChanges() {
  const channel = await drive.files
    .watch(
      {
        fileId: SHEET_ID,
      },
      { responseType: 'stream' },
    )
    .catch((err) => {
      logger.error(LogOrigin.Server, `getChanges ${err}`);
    });

  if (channel) {
    channel.data.on('data', (d) => {
      console.log(d);
    });
  }
}

export async function SheetAddEvent(event: Partial<OntimeEvent>, index: number) {
  sheets.spreadsheets
    .batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        requests: [
          {
            insertDimension: {
              range: {
                sheetId: 0,
                dimension: 'ROWS',
                startIndex: offset + index,
                endIndex: offset + index + 1,
              },
            },
          },
          { updateCells: cellRequenstFromEvent(event, index) },
        ],
      },
    })
    .catch((err) => {
      logger.error(LogOrigin.Server, `SheetAddEvent ${err}`);
    });
}

export async function SheetDeleteEvent(id: string, index: number) {
  if ((await testId(id, index)) === true) {
    sheets.spreadsheets
      .batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: 0,
                  dimension: 'ROWS',
                  startIndex: offset + index,
                  endIndex: offset + index + 1,
                },
              },
            },
          ],
        },
      })
      .catch((err) => {
        logger.error(LogOrigin.Server, `SheetDeleteEvent ${err}`);
      });
  }
}

export async function SheetDeleteAllEvents() {
  sheets.spreadsheets
    .batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        requests: [
          {
            // There hase to be at least 1 unfronzen row left
            insertDimension: {
              range: {
                sheetId: 0,
                dimension: 'ROWS',
                startIndex: offset,
                endIndex: offset + 1,
              },
            },
          },
          {
            deleteDimension: {
              range: {
                sheetId: 0,
                dimension: 'ROWS',
                startIndex: offset + 1,
              },
            },
          },
        ],
      },
    })
    .catch((err) => {
      logger.error(LogOrigin.Server, `SheetDeleteAllEvents ${err}`);
    });
}

export async function SheetReorderEvent(id: string, from: number, to: number) {
  to = to > from ? to + 1 : to;
  if ((await testId(id, from)) === true) {
    sheets.spreadsheets
      .batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
          requests: [
            {
              moveDimension: {
                source: {
                  sheetId: 0,
                  dimension: 'ROWS',
                  startIndex: offset + from,
                  endIndex: offset + from + 1,
                },
                destinationIndex: offset + to,
              },
            },
          ],
        },
      })
      .catch((err) => {
        logger.error(LogOrigin.Server, `SheetReorderEvent ${err}`);
      });
  }
}

export async function SheetEditEvent(event: Partial<OntimeEvent>, index: number) {
  if ((await testId(event.id, index)) === true) {
    sheets.spreadsheets
      .batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
          requests: [{ updateCells: cellRequenstFromEvent(event, index) }],
        },
      })
      .catch((err) => {
        logger.error(LogOrigin.Server, `SheetEditEvent ${err}`);
      });
  }
}

function hexToRgb(hex: string) {
  if (hex === null) {
    return {};
  }
  const bigint = parseInt(hex.slice(1), 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  return { red: r, green: g, blue: b };
}

function cellRequenstFromEvent(event: Partial<OntimeEvent>, index: number): sheets_v4.Schema$Request['updateCells'] {
  return {
    start: {
      sheetId: 0,
      rowIndex: offset + index,
      columnIndex: 0,
    },
    fields: 'userEnteredValue,userEnteredFormat.backgroundColor',
    rows: [
      {
        values: [
          { userEnteredValue: { stringValue: event.id } },
          { userEnteredValue: { numberValue: event.timeStart } },
          { userEnteredValue: { numberValue: event.timeEnd } },
          { userEnteredValue: { numberValue: event.duration } },
          { userEnteredValue: { stringValue: event.timerType } },
          { userEnteredValue: { stringValue: event.endAction } },
          {
            userEnteredValue: { stringValue: event.colour },
            userEnteredFormat: { backgroundColor: hexToRgb(event.colour) },
          },
          { userEnteredValue: { stringValue: event.cue } },
          { userEnteredValue: { boolValue: event.isPublic } },
          { userEnteredValue: { boolValue: event.skip } },
          { userEnteredValue: { stringValue: event.title } },
          { userEnteredValue: { stringValue: event.presenter } },
          { userEnteredValue: { stringValue: event.subtitle } },
          { userEnteredValue: { stringValue: event.note } },
          { userEnteredValue: { stringValue: event.user0 } },
          { userEnteredValue: { stringValue: event.user1 } },
          { userEnteredValue: { stringValue: event.user2 } },
          { userEnteredValue: { stringValue: event.user3 } },
          { userEnteredValue: { stringValue: event.user4 } },
          { userEnteredValue: { stringValue: event.user5 } },
          { userEnteredValue: { stringValue: event.user6 } },
          { userEnteredValue: { stringValue: event.user7 } },
          { userEnteredValue: { stringValue: event.user8 } },
          { userEnteredValue: { stringValue: event.user9 } },
        ],
      },
    ],
  };
}

async function testId(id: string, index: number) {
  let r = false;
  await sheets.spreadsheets.values
    .get({
      spreadsheetId: SHEET_ID,
      range: 'A' + (offset + index + 1).toString() + ':X' + (offset + index + 1).toString(),
    })
    .then((res) => {
      const value = res.data.values[0];
      if (id !== value[0]) {
        logger.error('SHEET', `The sheet is out off sync at least at ID: ${id}`);
      } else {
        r = true;
      }
    });
  return r;
}
