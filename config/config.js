/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the p2peers project
 */

/*jslint node:  true */
/*jslint nomen: true */
"use strict";

var config = {

	test: {
		mode: 'test',
		logFile: true,
		logConsole: false,
		port: 5000,
		securePort: 5001,
		adminName: 'admin',
		adminPwd: 'password',
		mongo: {
			host: 'localhost',
			port: 27017,
			name: 'p2peers-test',
			sessionName: 'sessionp2peers-test'
		}
	},
	
	local: {
		mode: 'local',
		logFile: false,
		logConsole: true,
		port: 5000,
		securePort: 5001,
		adminName: 'admin',
		adminPwd: 'password',
		mongo: {
			host: 'localhost',
			port: 27017,
			name: 'p2peers',
			sessionName: 'sessionp2peers'
		}
	},
	
	heroku: {
		mode: 'heroku',
		logFile: true,
		logConsole: true,
		port: process.env.PORT,
		securePort: process.env.PORT,
		adminName: 'herokuadmin',
		adminPwd: 'heroku_adm_pwd',
		mongo: {
			host: process.env.MUSER + ":" + process.env.MPWD + "@ds029901.mongolab.com",
			port: 29901,
			name: 'heroku_app32051551',
			sessionName: 'heroku_app32051551'
		}
	},
	
	production: {
		mode: 'production',
		logFile: true,
		logConsole: false,
		port: 80,
		securePort: 443,
		adminName: 'admin',
		adminPwd: 'password',
		mongo: {
			host: '127.0.0.1',
			port: 27017,
			name: 'remotedesk',
			sessionName: 'sessionp2peers'
		}
	}
};

module.exports = function (mode) {
	return config[mode || process.argv[2] || 'local'] || config.local;
};