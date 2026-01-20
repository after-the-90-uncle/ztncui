/*
  ztncui - ZeroTier network controller UI
  Copyright (C) 2017-2021  Key Networks (https://key-networks.com)
  Licensed under GPLv3 - see LICENSE for details.
*/

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// 导入路由
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const networkRoutes = require('./routes/networks');

/**
 * 创建Express应用实例
 */
const app = express();

/**
 * 安全中间件
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

/**
 * CORS配置
 */
app.use(cors({
  origin: config.api.cors.origin,
  credentials: config.api.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

/**
 * 请求限制
 */
const limiter = rateLimit({
  windowMs: config.api.rateLimit.windowMs,
  max: config.api.rateLimit.max,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: '请求过于频繁，请稍后再试'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

/**
 * 日志记录
 */
if (config.nodeEnv === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

/**
 * 请求体解析
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Cookie解析
 */
app.use(require('cookie-parser')());

/**
 * Session配置（向后兼容）
 */
app.use(session({
  secret: config.session.secret,
  resave: config.session.resave,
  saveUninitialized: config.session.saveUninitialized,
  cookie: config.session.cookie
}));

/**
 * 静态文件服务
 */
app.use(express.static('public'));

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/networks', networkRoutes);

/**
 * 健康检查端点
 */
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      environment: config.nodeEnv
    }
  });
});

/**
 * API信息端点
 */
app.get('/api', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'ztncui API',
      version: '2.0.0',
      description: 'ZeroTier Network Controller UI API',
      endpoints: {
        auth: '/api/auth',
        users: '/api/users',
        networks: '/api/networks'
      },
      documentation: 'https://github.com/key-networks/ztncui'
    }
  });
});

/**
 * 404错误处理
 */
app.use(notFoundHandler);

/**
 * 全局错误处理
 */
app.use(errorHandler);

/**
 * 启动服务器
 */
const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`🚀 ztncui API Server started on port ${PORT}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🔒 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  
  if (config.nodeEnv === 'development') {
    console.log('\n📋 Available API endpoints:');
    console.log('   POST   /api/auth/login       - 用户登录');
    console.log('   POST   /api/auth/logout      - 用户登出');
    console.log('   GET    /api/auth/profile     - 获取用户信息');
    console.log('   GET    /api/users            - 获取用户列表');
    console.log('   POST   /api/users            - 创建用户');
    console.log('   GET    /api/networks         - 获取网络列表');
    console.log('   POST   /api/networks         - 创建网络');
    console.log('   GET    /api/networks/:id     - 获取网络详情');
  }
});

/**
 * 优雅关闭
 */
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

module.exports = app;