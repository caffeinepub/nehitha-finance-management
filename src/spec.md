# Specification

## Summary
**Goal:** Remove the Customer Sign In step so customers can go directly from the landing page to the Add Request form.

**Planned changes:**
- Update the Landing page “Access Customer Portal” button to navigate directly to `/customer/request`.
- Remove the `/customer/signin` route from the frontend router and update any navigation/redirects that previously pointed to `/customer/signin` to instead go to `/customer/request` (or show Not Found if appropriate).
- Update the Customer Request post-submit success screen so its primary return action does not navigate to the removed sign-in route (use a valid route such as `/` or `/customer/request`).

**User-visible outcome:** Clicking “Access Customer Portal” opens the customer Add Request form without showing the Customer Sign In screen, and no part of the request flow sends users to `/customer/signin`.
