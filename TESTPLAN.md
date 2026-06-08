# Author: Chong Lee 
# End-to-End Testing Strategy for Sauce Demo (saucedemo.com)
This test plan focuses on the highest-priority user workflows within the application. The selected scenarios represent the most business-critical and user-facing functionality, with emphasis on transaction accuracy, authentication security, and cart management.

The following test cases have been prioritized based on business value, user impact, risk level, and potential impact on customer experience.
---
## **Priority 1: Add Items to Cart → Complete Checkout with Accurate Calculations** ✅

**Why This Is Critical:**
- **Highest User Impact**: The primary purpose of this website is to enable customers to purchase products. Any failure in adding items, calculating totals, or completing checkout directly impacts the user experience and can result in lost sales.
- **Business Value**: The checkout process is the core revenue-generating workflow of the application.
- **Risk Level**: CRITICAL - Financial accuracy is non-negotiable. Incorrect pricing, taxes, or totals can lead to customer dissatisfaction, loss of trust, and potential revenue impact.

**What to Test:**
- Add multiple items with varying prices to the cart.
- Verify the cart badge count updates correctly as items are added.
- Verify the number of items displayed in the cart matches the number of selected products.
- Verify cart contents accurately reflect the selected products.
- Verify subtotal calculations are correct based on the selected items.
- Verify subtotal, tax, and total calculations are accurate
- Verify the final total amount is calculated correctly.
- Proceed through the checkout process and complete the purchase.
- Verify the order confirmation page is displayed successfully.
- Verify the order summary reflects the correct products and pricing information.
- Verify that the cart badge count is updated correctly and displayed consistently across all authenticated pages.
- Verify that the names and prices of selected products remain accurate and consistent throughout the cart and checkout workflow.

**Automation Coverage**
- Validate cart badge count after adding multiple items.
- Validate the correct number of products are added to the cart.
- Execute the complete end-to-end purchasing workflow.

**Test Configuration**
- Test File: tests/cart/add-remove-checkout.spec.ts
- Project: chromium-auth, webkit-auth, firefox-auth
- Precondition: User authentication is pre-authorized before test execution using the authenticated Playwright project configuration.
---
## **Priority 2: Authentication (Login)** ✅
**Why This Is Critical:**
- **Security & Access Control:**: Authentication is the first line of defense against unauthorized access. Only authorized users should be able to access the application and its functionality.
**Data Protection**: Login controls help protect user information and prevent unauthorized access to customer data and account functionality.
- **User Impact**: Legitimate users must be able to access the system reliably, while invalid or restricted users must be prevented from gaining access.
- **Risk Level**: CRITICAL - Authentication failures can result in security vulnerabilities, compliance concerns, and loss of user trust.

**What to Test:**
- Successful authentication using valid user credentials.
- Rejection of invalid usernames and passwords.
- Validation of required fields and input handling.
- Proper handling of locked or restricted user accounts.

**Automation Coverage**
**Valid User Authentication**
- Verify successful login using:
  - standard_user
- Verify authenticated users are redirected to the inventory page after login.

**Invalid Authentication Scenarios**
- Verify login fails with a valid username and incorrect password.
- Verify login fails with an invalid username.
- Verify login fails when both username and password fields are empty.

**Access Restriction Validation**
- Verify locked_out_user cannot authenticate, even when the correct password is provided.
- Verify appropriate error messaging is displayed for restricted users.

**Logout**
- Verify users can successfully log out.
- Verify direct access to protected pages (e.g., inventory page) is blocked after logout.
- Verify session data and authentication cookies are cleared after logout.
- Verify users must re-authenticate to regain access to protected pages.

**Error Handling & User Experience**
- Verify authentication errors display clear and actionable messages.
- Verify the error message close button functions correctly.
- Verify dismissing the error message removes it from the UI.

**Test Configuration**
- Test File: tests/login/authentication.spec.ts
- Projects: chromium, firefox, webkit
- Precondition: None. Authentication tests intentionally begin from an unauthenticated state and do not use pre-authorized sessions.

## Validate Product Images and Performance-Related User Scenarios
# Note: 
This validation is important because incorrect product images may confuse users and lead to incorrect purchasing decisions. While this issue is uncommon, it is still important to verify.
# Product Image Validation
# standard_user
- Verify that all product images are displayed correctly and match the corresponding product details.
# problem_user
- Verify that product images are intentionally incorrect and do not match the corresponding product details.

## Performance Validation
# performance_glitch_user
- Verify that login performance is degraded.
- Confirm that the login process takes approximately 5 seconds or longer to complete.
- Ensure the user is eventually logged in successfully despite the delay.

**Test Configuration**
- Test File: tests/login/validateInventory.spec.ts
- Projects: chromium, firefox, webkit
- Precondition: None. Authentication tests intentionally begin from an unauthenticated state and do not use pre-authorized sessions.

---
## **Priority 3: Remove from Cart** ✅
**Why This Is Critical:**
- **User Experience**: Customers need the ability to modify their purchases. If items cannot be removed from the cart, it can lead to frustration and cart abandonment.
- **Order Accuracy**:  Ensures customers can remove unwanted items before checkout, reducing the risk of incorrect orders.
- **Business Impact**: Incorrect cart calculations after item removal can result in inaccurate pricing, directly affecting revenue and customer trust.

**What to Test:**
Users can remove items from two locations within the application:
- Inventory Page
- Cart Page

- The automated test validates both removal paths:
**Cart Page Removal**
- Remove an item from the cart.
- Verify the cart is empty after the item is removed.
- Verify the cart badge/count is updated correctly.

**Inventory Page Removal**
- Remove an item directly from the inventory page.
- Verify the item is no longer present in the cart.
- Verify the cart badge/count is updated correctly.
- Verify all cart calculations and totals are updated accurately after the item is removed.

**Automation Coverage**
- Test File: tests/cart/add-remove-checkout.spec.ts
- Project: chromium-auth, webkit-auth, firefox-auth
- Precondition: User authentication is pre-authorized before test execution. 
- The test runs using the authenticated Playwright project configuration(chromium-auth).

**Coverage:**
- Add item(s) to cart
- Remove item(s) from the Inventory Page
- Remove item(s) from the Cart Page
- Verify cart badge/count updates correctly
- Verify cart contents are updated correctly
- Verify cart calculations remain accurate after item removal
- Complete checkout flow
---
## Testing Approach Summary
| Flow | Priority | User Impact | Criticality | Risk |
|------|----------|-----------|------------|------|
| Login | **P1** | Blocks access | Security/authentication | CRITICAL |
| Add & Checkout | **P1** | Revenue flow | Business transaction | CRITICAL |
| Remove from Cart | **P2** | Order accuracy | Operational | HIGH |

# Design Decision: Page Object Model (POM)
The framework uses the Page Object Model (POM) design pattern to provide a clear separation between test logic and page interactions.
While modern automation tools and AI-assisted development can reduce the need for extensive abstraction, a lightweight Page Object Model continues to provide organizational and maintainability benefits for collaborative test automation projects.

This approach was selected to:
- Improve readability and maintainability of test code.
- Centralize page locators and UI interactions in a single location.
- Reduce code duplication across test suites.
- Simplify updates when application UI elements change.
- Allow test cases to focus on business workflows rather than implementation details.

The implementation intentionally remains lightweight and avoids unnecessary abstraction or over-engineering. The goal is to provide a structure that is easy for engineers, testers, reviewers, and future contributors to understand while maintaining flexibility for future enhancements.

**Page Object Structure**
**Base Page**: The parent class for all page objects.
# Responsibilities:
Common Playwright interactions
Shared helper methods
Reusable page functionality
Consistent abstraction layer for page operations

**Autehtication Page**: The sub-parent class for authenticated page objects.
Ex: Inventory, Cart, and Checkout
# Responsibilities:
Get Header 
Get Subtitle 
Check page loaded by checking subtitle

**Login Page**: Represents the application's login page.
# Responsibilities:
User authentication
Login validation
Login error handling
Authentication-related page interactions

**Inventory Page**: inventory/products page.
# Responsibilities:
- Product interactions
- Add/remove cart actions
- Product verification
- Inventory page validations

**Cart Page**: represents the shopping cart page.
Responsibilities:
- Cart item management
- Cart validation

**Checkout Page**: Represents the checkout workflow.
- checkout folder: contains 3 pages 
  - StepOnePage.ts
  - StepTwoPage.ts
  - CompletePage.ts
# Responsibilities:
- Customer information entry
- Checkout overview validation
- Price verification
- Order completion
**Note**: the checkout process spans multiple screens and access through CheckoutManager (managers/CheckoutManager.ts)

**Page Manager**: The framework uses a centralized Page Manager to instantiate and manage page objects.
# Benefits:
- Single location for page object creation
- Reduced test setup code
- Improved maintainability
- Consistent object lifecycle management
**Note**: Page objects are accessed through Playwright fixtures, allowing tests to remain clean and focused on business workflows rather than object initialization.
**Location**: managers/ManagerPage.ts

**User Configuration**
- User credentials and test user information are maintained in a centralized configuration file: 
- Also, environment-specific settings are maintained in a centralized configuration file: config/user.config.ts

# Benefits:
- Provide a single source of truth for test data and environment settings.x
- Easier maintenance of credentials
- Reusable across multiple test suites
- Accessed through Playwright fixtures

# Responsibilities:
- Store test user credentials in a single location.
- Manage environment-specific configuration values.
- Support multiple deployment environments such as: QA, Staging, Production
- Improve maintainability by avoiding hard-coded values throughout the test suite.

**Playwright Fixtures**
- Custom Playwright fixtures are used to centralize test setup and improve maintainability by providing shared objects to test cases.
# Location: fixtures/fixtures.ts
# Current fixtures include:
# config – Provides access to test configuration values used across the test suite.
# managerPage – Provides a pre-initialized page object, reducing repetitive setup code in individual tests.
- Using fixtures helps keep test files clean, promotes code reuse, and ensures consistent initialization of common test dependencies.

**Components**
- The components folder contains reusable UI components that are shared across multiple pages. These components help improve maintainability, reduce code duplication, and provide a consistent interface for interacting with common application elements.

# BurgerMenu.ts
- Represents the burger (hamburger) menu located in the top-left corner of the application. This component contains actions and validations related to the navigation menu including logout

# Header.ts
- Represents the application header displayed at the top of the page. The header acts as a container for common UI elements and includes:
- BurgerMenu
- Logo
- CartComponent

# CartComponent.ts
- Represents the shopping cart section within the header. This component provides access to: The cart link/button
The cart badge displaying the current number of items in the cart

# Logo.ts
- Represents the application logo displayed in the center of the header. This component contains interactions and validations related to the logo element.

**Interfaces**
- The interfaces folder contains TypeScript interfaces used to define and enforce the structure of application data throughout the test automation framework. Using interfaces improves type safety, code readability, and maintainability.

# Product.ts
- Defines the structure of a product object used within the test suite.
- The Product interface contains the following properties:
- name: The product name.
- description: The product description.
- price: The product price.

**Utilities**
- The utils folder contains reusable utility functions and helper classes that support test execution and reduce code duplication across the automation framework.
# price-utils.ts
- Contains utility functions for working with product prices.
- Responsibilities include:
- Converting a price represented as a string (e.g., "$29.99") into a numeric value for calculations and validations.
- Supporting price comparisons and sorting validations within test cases.

# ProductHelpers.ts
- Provides reusable helper methods for interacting with products on inventory-related pages.
- This helper is accessed through the ManagerPage because it requires page-level access to interact with UI elements.
- Available methods include:
# getProductDetails – Retrieves product information, including name, description, and price.
# addItemToCart – Adds a specified product to the shopping cart.
# removeItemFromCart – Removes a specified product from the shopping cart.
# getAddButton – Returns the locator for a product's "Add to Cart" button.
# getRemoveButton – Returns the locator for a product's "Remove" button.
- These utilities help centralize common product-related operations and improve maintainability by avoiding duplicated logic throughout the test suite.

**Visual Snapshots**
- The visual-snapshots folder contains baseline images used for visual regression testing.
- Currently, the folder includes the reference images for all six product item photos displayed in the inventory page. These baseline snapshots are compared against screenshots captured during test execution to verify that product images are displayed correctly and have not changed unexpectedly.
- Including these baseline images in source control ensures that:
  - Visual comparison tests can run successfully on a fresh checkout of the project.
  - New team members can execute the test suite without needing to generate snapshots manually.
  - The first test run does not fail due to missing baseline images.
  - Product image validation remains consistent across different environments and test executions.
- These snapshots support image verification scenarios, including validation of correct and intentionally incorrect product images for different user types.
# Author: Chong Lee 
**Test Structure**
**Authentication Setup**
**tests/auth.setup.ts**
This setup file performs pre-authentication and stores authenticated user session information.
# Benefits:
- Eliminates repeated login steps across tests
- Reduces overall execution time
- Improves test stability
- Minimizes authentication-related test flakiness

Authenticated projects reuse the saved session state rather than performing a UI login before every test.

# Test Files
tests/
└── login/
      └── authentication.spec.ts
      └── validateInventory.spec.ts
├── auth.setup.ts
└── cart/
    └── add-remove-checkout.spec.ts

**authentication.spec.ts**
Covers:
- Valid login and logout scenarios
- Invalid login scenarios
- Locked user validation

**validateInventory.spec.ts**
Covers:
- Verify that product images are displayed correctly for the standard_user.
- Verify that incorrect product images are displayed for the problem_user.
- Verify that the performance_glitch_user can successfully log in within 15 seconds despite the expected performance delay.

**add-remove-checkout.spec.ts**
Covers:
- Add products to cart
- Remove products from cart
- Cart validation
- Badge count verification
- Checkout workflow
- Price calculations (subtotal, tax, and total)
- Order confirmation validation

# Cross-Browser Coverage: 
The automated test suite is executed across the following browser engines to validate consistent functionality and user experience:
- Chromium (Chrome)
- Firefox
- WebKit

**NOTE:** Please refer to README.md for prerequisites, installation instructions, environment configuration, and test execution commands.
# Author: Chong Lee 
