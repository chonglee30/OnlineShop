### Running Your Tests
Include a README with:
- Prerequisites (Node version, dependencies)
Node.js v25.2.1
npm (included with Node.js)
- How to install: `npm install`
- Install Playwright browsers: npx playwright install
- How to run tests: `npm test` (or equivalent)
- Tests should run in headless mode by default

**Test Execution**
**Run Chromium Tests Only**
- Execute all tests using the Chromium browser: 
# npm run test:chromium-only
**Run Authentication Tests Only**
- Execute all authentication and login-related test cases: 
# npm run test:auth-ui
**Run Cart and Checkout Tests**
# npm run test:cart
- Add items to cart
- Remove items from cart
- Cart validation
- Checkout process
- Price calculations (subtotal, tax, and total)

**Run All Tests**
# npm run test:all
- Execute the complete test suite across all configured projects: 

**Test Reports**
- After execution, Playwright generates test results and reports.
- To view the HTML report: npx playwright show-report
