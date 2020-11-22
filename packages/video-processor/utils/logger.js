const Logger = require('logdna');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

if (IS_PRODUCTION) {
	const options = {
		env: 'env',
		app: 'video-processor',
		hostname: 'video-processor',
		index_meta: true,
	};

	const _log = console.log;
	const _error = console.error;

	const logger = Logger.setupDefaultLogger(process.env.LOGDNA_API_KEY, options);

	const log = function() {
		logger.log([...arguments].join(' '));
		_log.apply(console, arguments);
	};

	const error = function() {
		logger.error([...arguments].join(' '));
		_error.apply(console, arguments);
	};

	console.log = log;
	console.error = error;

	console.log('Video Processor boot complete');
}
