# AGENTS.md - Agentic Coding Guidelines for ztncui

## Overview

This document provides comprehensive guidelines for agentic coding assistants working on the ztncui (ZeroTier Network Controller UI) project. ztncui is a Node.js Express application that provides a web interface for managing ZeroTier network controllers.

## Project Structure

- **Main Application**: `src/app.js` (Express server setup)
- **Routes**: `src/routes/` (Express route definitions)
- **Controllers**: `src/controllers/` (Business logic)
- **Views**: `src/views/` (Pug templates)
- **Public Assets**: `src/public/` (Static files, CSS, images)
- **Configuration**: `src/etc/` (Password files, TLS certs)
- **Build Scripts**: `build/` (RPM/DEB packaging)

## Build, Test, and Development Commands

### Primary Development Commands

```bash
# Install dependencies
cd src && npm install

# Start development server (with nodemon auto-restart)
npm run devstart

# Start production server
npm start

# Run server manually
node ./bin/www
```

### Testing

**Note**: This project does not currently have automated tests configured. Manual testing is performed by:

1. Starting the application with `npm start`
2. Accessing the web interface at `http://localhost:3000`
3. Testing user authentication, network creation, and member management features

### Build and Packaging

```bash
# Build RPM and DEB packages (Linux only)
cd build && ./build.sh

# The build script handles:
# - Node.js dependency installation
# - Argon2 native compilation
# - Binary packaging with pkg
# - RPM/DEB package creation
```

### Environment Configuration

Create a `.env` file in the project root:

```env
# ZeroTier API configuration
ZT_TOKEN=your_zerotier_token_here
ZT_ADDR=localhost:9993

# Server configuration
NODE_ENV=production  # Set to 'production' to disable Pug template caching
HTTP_PORT=3000
HTTP_ALL_INTERFACES=yes  # Listen on all interfaces
HTTPS_PORT=3443         # Enable HTTPS
HTTPS_HOST=your.domain.com

# Security
SESSION_SECRET=your_random_session_secret
```

## Code Style Guidelines

### Language and Module System

- **JavaScript Version**: ES6+ (Node.js 14+)
- **Module System**: CommonJS (`require`/`module.exports`)
- **File Extensions**: `.js` for all JavaScript files

### Import/Export Patterns

```javascript
// Core Node.js modules first
const fs = require('fs');
const path = require('path');

// Third-party dependencies (alphabetical)
const argon2 = require('argon2');
const express = require('express');
const got = require('got');

// Local modules
const auth = require('../controllers/auth');
const token = require('./token');
```

### Naming Conventions

- **Variables**: `camelCase` (e.g., `userName`, `ztAddress`)
- **Functions**: `snake_case` for utility functions, `camelCase` for methods (e.g., `get_users()`, `validateInput()`)
- **Constants**: `UPPER_SNAKE_CASE` for configuration constants
- **Files**: `kebab-case.js` for routes and utilities, `PascalCase.js` for controllers
- **Directories**: `snake_case`

### Asynchronous Code

- **Preferred**: `async`/`await` over Promises/callbacks
- **Error Handling**: `try`/`catch` blocks for all async operations
- **Promisification**: Use `util.promisify()` for callback-based APIs

```javascript
const readFile = util.promisify(fs.readFile);

const getData = async function() {
  try {
    const data = await readFile('file.txt', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Failed to read data: ${err.message}`);
  }
};
```

### Object and Data Structures

- **Object Literals**: Multi-line with consistent indentation
- **Array Methods**: Prefer `forEach`, `map`, `filter` over traditional loops where appropriate
- **Destructuring**: Use for function parameters and return values

```javascript
// Good: Multi-line object literals
const navigate = {
  active: 'users',
  title: 'User Management'
};

// Good: Destructuring
const { name, hash } = user;
const [first, second] = results;
```

### Error Handling

- **Validation**: Use `express-validator` for input validation
- **Custom Errors**: Throw descriptive Error objects
- **Middleware**: Use Express error handling middleware for 404s and server errors
- **User Feedback**: Store messages in `req.session.error`/`req.session.success`

```javascript
// Input validation
req.checkBody('username', 'Username required').notEmpty();
req.checkBody('password', 'Password must be at least 10 characters').isLength({ min: 10 });

// Error throwing
if (!user) {
  throw new Error('User not found');
}

// Session messages
req.session.error = 'Invalid credentials';
req.session.success = 'Password updated successfully';
```

### Security Practices

- **Password Hashing**: Use `argon2` for password hashing
- **Session Management**: Random session secrets, secure cookie settings
- **Input Sanitization**: Use `express-validator` escape and trim
- **HTTPS**: Configure TLS certificates for production
- **Helmet**: Enable security headers with `helmet` middleware

### File Permissions

- **Password Files**: `chmod 600` (owner read/write only)
- **TLS Certificates**: Secure private key permissions
- **Configuration Files**: Restrict access appropriately

### Template Engine (Pug)

- **File Extension**: `.pug`
- **Variables**: Pass data objects to `res.render()`
- **Layout System**: Use includes and extends for reusable components
- **Conditional Rendering**: Use Pug's conditional syntax
- **Iteration**: Use `each` for loops

```pug
//- Example template structure
extends layout

block content
  if users
    each user in users
      .user-card
        h3=user.name
        p=user.email
  else
    p No users found
```

### Routing Patterns

- **Route Organization**: Separate route files in `src/routes/`
- **Middleware**: Use `auth.restrict` for protected routes
- **HTTP Methods**: Follow RESTful conventions
- **Parameter Handling**: Use route parameters and query strings appropriately

```javascript
// Route definition
router.get('/users/:name', restrict, usersController.user_detail);
router.post('/users/:name/password', restrict, usersController.password_post);
```

### Controller Patterns

- **Separation of Concerns**: Keep business logic in controllers
- **Response Handling**: Controllers handle both success and error rendering
- **Data Validation**: Validate input before processing
- **Session Management**: Use sessions for user state and flash messages

### Configuration Management

- **Environment Variables**: Use `process.env` for configuration
- **Default Values**: Provide sensible defaults with `||` operator
- **Validation**: Validate required environment variables on startup

### Logging and Debugging

- **Morgan**: HTTP request logging middleware
- **Console Output**: Use `console.log()` sparingly, prefer structured logging
- **Development Mode**: Show detailed errors in development only

### Dependencies and Libraries

#### Core Framework
- **Express**: Web framework with middleware support
- **Pug**: Template engine for server-side rendering

#### Authentication & Security
- **Argon2**: Password hashing (requires native compilation)
- **Express-session**: Session management
- **Helmet**: Security headers

#### HTTP Client
- **Got**: Modern HTTP request library (successor to request)

#### Validation
- **Express-validator**: Input validation and sanitization

#### Utilities
- **IP-address**: IP address manipulation
- **Node-persist**: Simple data persistence
- **Serve-favicon**: Favicon middleware

#### Frontend
- **Bootstrap 3.4.1**: CSS framework
- **jQuery 3.4.1**: DOM manipulation (legacy)

### API Integration

- **ZeroTier API**: Communicate with ZeroTier controller via HTTP API
- **Authentication**: Use `X-ZT1-Auth` header with token
- **Error Handling**: Handle network timeouts and API errors gracefully

### Database/Persistence

- **File-based**: JSON file storage for user credentials
- **No Database**: Simple file operations for configuration
- **Atomic Writes**: Write to temporary files then rename for safety

## Development Workflow

1. **Setup**: Clone repo, run `npm install` in `src/` directory
2. **Configuration**: Set up `.env` file with ZeroTier credentials
3. **Development**: Use `npm run devstart` for auto-restarting server
4. **Testing**: Manual testing through web interface
5. **Build**: Use `build/build.sh` for package creation

## Common Patterns and Anti-patterns

### Preferred Patterns

```javascript
// Async function with proper error handling
const getUsers = async function() {
  try {
    const users = await readUsersFromFile();
    return users;
  } catch (err) {
    throw new Error(`Failed to get users: ${err.message}`);
  }
};

// Input validation
req.checkBody('email', 'Valid email required').isEmail();
req.sanitize('email').normalizeEmail();

// Session-based messaging
req.session.success = 'Operation completed successfully';
res.redirect('/users');
```

### Anti-patterns to Avoid

```javascript
// Don't use callbacks in new code
fs.readFile('file.txt', (err, data) => {
  if (err) throw err;
  // process data
});

// Don't use var
var users = [];

// Don't skip input validation
// WRONG: No validation
const userId = req.body.userId;

// Don't hardcode sensitive data
const token = 'hardcoded-secret'; // Use environment variables instead
```

## Deployment Considerations

- **Node.js Version**: Requires Node.js 14+ (build script checks for v14)
- **ZeroTier**: Must be installed and running on the same system
- **Permissions**: User running ztncui needs access to ZeroTier authtoken
- **Systemd**: Use provided service file for production deployment
- **TLS**: Configure certificates for HTTPS in production

## Code Review Checklist

- [ ] License header present on all source files
- [ ] Async/await used for asynchronous operations
- [ ] Proper error handling with try/catch
- [ ] Input validation with express-validator
- [ ] Session messages for user feedback
- [ ] No hardcoded secrets or sensitive data
- [ ] File permissions set correctly for sensitive files
- [ ] Environment variables used for configuration
- [ ] Code follows established naming conventions
- [ ] No use of deprecated libraries or patterns

## Contributing Guidelines

- Maintain backward compatibility where possible
- Update documentation for API changes
- Test changes manually through the web interface
- Follow existing code patterns and conventions
- Use meaningful commit messages following project style

---

*This document was generated by analyzing the ztncui codebase. Last updated: 2026-01-17*</content>
<parameter name="filePath">AGENTS.md