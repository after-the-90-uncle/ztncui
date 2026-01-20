/*
  ztncui - ZeroTier network controller UI
  Copyright (C) 2017-2021  Key Networks (https://key-networks.com)
  Licensed under GPLv3 - see LICENSE for details.
*/

require('dotenv').config();

const config = {
  // Server Configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'ztncui-jwt-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },

  // ZeroTier API Configuration
  zerotier: {
    addr: process.env.ZT_ADDR || 'localhost:9993',
    token: process.env.ZT_TOKEN
  },

  // Session Configuration
  session: {
    secret: process.env.SESSION_SECRET || Math.random().toString(36).substring(2, 12),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  },

  // File Paths
  files: {
    passwd: 'etc/passwd',
    storage: 'etc/storage'
  },

  // User Configuration
  user: {
    minPasswordLength: 10
  },

  // API Configuration
  api: {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  }
};

module.exports = config;
