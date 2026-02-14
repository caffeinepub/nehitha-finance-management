# Specification

## Summary
**Goal:** Fix the Landing page "Access Admin Portal" button so it navigates to the external Admin Portal URL instead of an internal route.

**Planned changes:**
- Update the Landing page "Access Admin Portal" button/link to perform a full-page navigation in the same tab to `https://nehitha-thandal-managementtool-0c2.caffeine.xyz/`.
- Ensure the "Access Customer Portal" button continues to route to `/customer/signin` as it does today.

**User-visible outcome:** On the landing page, tapping/clicking "Access Admin Portal" opens the external Admin Portal in the same browser tab (mobile and desktop), while "Access Customer Portal" still goes to the customer sign-in page.
