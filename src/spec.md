# Specification

## Summary
**Goal:** Simplify the landing page by removing the marketing tagline and the Admin Portal entry card shown in the screenshot.

**Planned changes:**
- Update `frontend/src/pages/LandingPage.tsx` to remove the paragraph text: “Streamline your financial operations with our comprehensive management platform”.
- Remove the entire “Admin Portal” card from the landing page (icon, title, description, and “Access Admin Portal” button/link).
- Adjust layout so remaining landing-page content is centered and looks intentional after the removal (e.g., single-card layout).
- Clean up any unused imports/handlers in `LandingPage.tsx` that were only used for the removed Admin Portal UI.

**User-visible outcome:** The landing page no longer shows the marketing tagline or any Admin Portal card/button, and the remaining content is neatly centered without layout issues.
