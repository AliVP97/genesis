import { clear } from 'console';

// change if you want to see the detail
const VERBOSE = false;

const COLOR_VARIANTS = {
  success: '\x1b[92m',
  warn: '\x1b[93m',
  error: '\x1b[91m',
  info: '\x1b[94m',
  reset: '\x1b[0m',
};

const STATUS_EMOJIS = {
  'FETCHING TYPE': '🔄',
  'TYPE FETCHED': '✅',
  'FILE CREATED': '🎉',
  ERROR: '❌',
};

const writer = (message, color = COLOR_VARIANTS.info) => {
  setTimeout(() => {
    console.log([color, message, COLOR_VARIANTS.reset].join(' '));
  }, 0);
};

const addTimeStamp = (message) => {
  const timestamp = Date.now() - process.env.START_TIME;
  const extendedLength = 5 - timestamp.toString().length;

  return [`${' '.repeat(extendedLength)}[+${timestamp}ms]`, message].join(' ');
};

const prepareMessage = (args) => addTimeStamp(args.join(''));

const log = (...args) => writer(prepareMessage(args));

const success = (...args) => writer(prepareMessage(args), COLOR_VARIANTS.success);

const warn = (...args) => writer(prepareMessage(args), COLOR_VARIANTS.warn);

const error = (...args) => writer(prepareMessage(args), COLOR_VARIANTS.error);

const statusMap = {}; // Store endpoint status

const updateStatus = (key, status, variant = 'info') => {
  const updatedStatus = {
    timestamp: addTimeStamp(),
    status: `${STATUS_EMOJIS[status] || ''} ${status}`,
    color: COLOR_VARIANTS[variant],
  };
  statusMap[key] = updatedStatus;

  renderStatus(key, updatedStatus);
};

const renderStatus = (updatedKey, updatedStatus) => {
  if (VERBOSE === false) {
    process.stdout.cursorTo?.(0, 0);
    process.stdout.clearScreenDown?.();
  }

  if (process.stdout.cursorTo && process.stdout.clearScreenDown && VERBOSE === false) {
    Object.entries(statusMap).forEach(([key, { timestamp, status, color }]) => {
      console.log([timestamp, color, status, COLOR_VARIANTS.reset, `[${key}]`].join(' '));
    });
  } else {
    const { timestamp, color, status } = updatedStatus;

    console.log([timestamp, color, status, COLOR_VARIANTS.reset, `[${updatedKey}]`].join(' '));
  }
};

const verbose = (func, ...args) => VERBOSE && func(args);

export const logger = {
  verbose,
  log,
  success,
  warn,
  error,
  clear,
  updateStatus,
};
