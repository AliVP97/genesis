import path from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
import openapiTS from 'openapi-typescript';

import { logger } from './utils/logger.mjs';
import { TYPE_DIR, SWAGGER_SERVICE_NAMES } from './constants.mjs';

const runTask = async ({ baseUrl, serviceName = '', fileName }) => {
  const url = `${baseUrl}${serviceName}.json`;
  const dir = path.join(TYPE_DIR, `${fileName || serviceName}.ts`);

  logger.updateStatus(serviceName || fileName, 'FETCHING TYPE', 'warn');

  try {
    const contents = await openapiTS(url);
    logger.updateStatus(serviceName || fileName, 'TYPE FETCHED', 'success');

    try {
      writeFileSync(dir, contents);
      logger.updateStatus(serviceName || fileName, 'FILE CREATED', 'success');
    } catch (error) {
      logger.updateStatus(serviceName || fileName, 'FILE CREATION FAILED');
      logger.verbose(logger.error, 'url: ', url);
      logger.verbose(logger.error, 'dir: ', dir);
      logger.verbose(logger.error, 'error: ', error);
      throw error;
    }
  } catch (error) {
    logger.updateStatus(serviceName || fileName, 'FETCHING FAILED', 'error');
    logger.verbose(logger.error, 'url: ', url);
    logger.verbose(logger.error, 'dir: ', dir);
    logger.verbose(logger.error, 'error: ', error);
    throw error;
  }
};

process.env.START_TIME = Date.now();

const taskPipeline = async () => {
  logger.clear();

  try {
    mkdirSync(TYPE_DIR, { recursive: true });
  } catch (error) {
    logger.error('Failed to create types directory:', error);
  }

  await Promise.all(SWAGGER_SERVICE_NAMES.map(runTask));
};

taskPipeline()
  .then(() => {
    const time = Date.now() - process.env.START_TIME;
    logger.success('🎉 All types has been fetched successfully in  ', time, ' ms 🎉');
  })
  .catch((err) => {
    if (err.errno === -3008) {
      logger.error('Please check your network and retry (including your connection and vpn etc.)');
    } else {
      logger.error(err);
    }
  });
