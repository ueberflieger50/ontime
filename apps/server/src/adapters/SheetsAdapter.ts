import { google } from 'googleapis';
import { parseExcel } from '../utils/parser.js';
import { getAppDataPath } from '../setup.js';
import { authenticate } from '@google-cloud/local-auth';
import fs from 'fs/promises';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = path.join(getAppDataPath(), 'token.json');
const CREDENTIALS_PATH = path.join(getAppDataPath(), 'credentials.json');

async function listMajors(auth) {
  const sheets = google.sheets({
    version: 'v4',
    auth,
  });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: '1oGGEg3vBPlQTf5EOTHFHjU7x7aujSXeaXk650ti-Hds',
    range: 'Event schedule!A1:X',
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log('No data found.');
    return;
  }
  console.log(parseExcel(rows));

  await sheets.spreadsheets.values.update({
    spreadsheetId: '1oGGEg3vBPlQTf5EOTHFHjU7x7aujSXeaXk650ti-Hds',
    range: 'Event schedule!A48:X',
    valueInputOption: 'RAW',
    requestBody: {
        values: [['test']],
      },
  });

}

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = (await fs.readFile(TOKEN_PATH)).toString();
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
  const content = (await fs.readFile(CREDENTIALS_PATH)).toString();
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
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

export async function loadSheet() {
  authorize().then((auth) => {
    listMajors(auth).catch(console.error);
  });
}
