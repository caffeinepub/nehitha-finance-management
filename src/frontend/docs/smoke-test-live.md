# Live Environment Smoke Test

This document provides a step-by-step manual smoke test procedure for the Nehitha Thandal Management application in the live production environment.

## Test Environment

- **Environment:** Production (Live)
- **URL:** https://Nehitha-Thandal-Customer-Management-Tool.icp.app
- **Browser:** Chrome/Firefox/Safari (test on primary browser)
- **Device:** Desktop and Mobile (responsive check)

## Pre-Test Setup

1. Open browser DevTools (F12)
2. Open Console tab to monitor for errors
3. Open Network tab to verify asset loading
4. Clear browser cache (Ctrl+Shift+Delete) to ensure fresh assets
5. Perform hard reload (Ctrl+Shift+R)

## Test Execution Record

**Test Date:** _______________

**Tested By:** _______________

**Browser:** _______________

**Device:** _______________

**Expected Version:** Draft Version 14

---

## Test Cases

### Test 1: Landing Page Load

**URL:** `/` (root)

**Expected Result:**
- Page loads without errors
- "Nehitha Thandal Management" heading is visible
- Single "Customer Portal" card is displayed
- No "Admin Portal" card is present
- No marketing tagline text
- Footer displays "Nehitha Thandal Management" and caffeine.ai attribution
- **Footer version label shows: "Draft Version 14"**
- **Critical:** No AppErrorBoundary fallback UI is shown (no "Something went wrong" message with `data-error-marker="runtime-error-fallback"`)

**Verification:**
- [ ] Page renders successfully
- [ ] No console errors
- [ ] No network errors (check Network tab)
- [ ] No error boundary fallback visible
- [ ] Version label shows "Draft Version 14"

**Record:**
- Timestamp: _______________
- Browser: _______________
- Result: PASS / FAIL
- Version label displayed: _______________
- Notes: _______________

---

### Test 2: Customer Sign-In Navigation

**URL:** `/customer/signin`

**Expected Result:**
- Customer sign-in page loads successfully
- Email input field is visible
- "Sign In" button is present
- Page layout is consistent with landing page (header/footer)
- Footer version label shows "Draft Version 14"
- No error boundary fallback

**Verification:**
- [ ] Page renders successfully
- [ ] Form elements are interactive
- [ ] No console errors
- [ ] No error boundary fallback visible
- [ ] Version label shows "Draft Version 14"

**Record:**
- Timestamp: _______________
- Browser: _______________
- Result: PASS / FAIL
- Notes: _______________

---

### Test 3: Landing to Sign-In Flow

**Starting URL:** `/`

**Steps:**
1. Click "Access Customer Portal" button on landing page
2. Verify navigation to `/customer/signin`
3. Check footer version label remains "Draft Version 14"

**Expected Result:**
- Navigation occurs without page reload
- URL changes to `/customer/signin`
- Customer sign-in page renders
- No console errors during navigation
- Version label persists across navigation

**Verification:**
- [ ] Navigation works smoothly
- [ ] No flash of error content
- [ ] No console errors
- [ ] Version label consistent across pages

**Record:**
- Timestamp: _______________
- Browser: _______________
- Result: PASS / FAIL
- Notes: _______________

---

### Test 4: 404 Not Found Handling

**URL:** `/nonexistent-route-12345`

**Expected Result:**
- NotFoundPage component renders
- "404 - Page Not Found" message is displayed
- Navigation options are available (Back / Home)
- Footer version label shows "Draft Version 14"
- No error boundary fallback (this is expected behavior, not an error)

**Verification:**
- [ ] 404 page renders correctly
- [ ] Navigation buttons work
- [ ] No console errors (404 routing is expected)
- [ ] Version label shows "Draft Version 14"

**Record:**
- Timestamp: _______________
- Browser: _______________
- Result: PASS / FAIL
- Notes: _______________

---

### Test 5: Error Boundary Verification (Negative Test)

**Purpose:** Verify that the error boundary fallback UI is NOT shown during normal operation.

**Steps:**
1. Navigate to `/`
2. Navigate to `/customer/signin`
3. Navigate back to `/`
4. Navigate to `/nonexistent-route-12345` (404)
5. Navigate back to `/`

**Expected Result:**
- No error boundary fallback UI appears at any point
- No element with `data-error-marker="runtime-error-fallback"` is present in the DOM
- No element with `data-testid="app-error-boundary"` is present in the DOM
- Version label shows "Draft Version 14" on all pages

**Verification:**
- [ ] No error boundary fallback during normal navigation
- [ ] Application functions normally
- [ ] Version label consistent across all routes

**Record:**
- Timestamp: _______________
- Browser: _______________
- Result: PASS / FAIL
- Notes: _______________

---

### Test 6: Version Label Verification (Critical for Rollback)

**Purpose:** Explicitly verify that the correct frontend version is deployed.

**Steps:**
1. Navigate to `/`
2. Scroll to footer
3. Locate version label (small text below caffeine.ai attribution)
4. Verify text reads: "Draft Version 14"

**Expected Result:**
- Version label is visible in footer
- Text reads exactly: "Draft Version 14"
- Label has `data-version-label` attribute (for automated testing)

**Verification:**
- [ ] Version label is present
- [ ] Version label shows "Draft Version 14"
- [ ] Version label is readable (not hidden or obscured)

**Record:**
- Timestamp: _______________
- Browser: _______________
- Result: PASS / FAIL
- Actual version displayed: _______________
- Notes: _______________

**If version label shows incorrect version:**
1. Clear browser cache completely
2. Perform hard reload (Ctrl+Shift+R)
3. Retry test
4. If still incorrect, initiate rollback investigation

---

## Mobile Responsiveness Check

Repeat Tests 1-3 and Test 6 on a mobile device or using browser DevTools mobile emulation:

**Device/Emulation:** _______________

**Verification:**
- [ ] Landing page is mobile-friendly
- [ ] Customer Portal card is readable and clickable
- [ ] Sign-in form is usable on mobile
- [ ] Navigation works on mobile
- [ ] Version label is visible and readable on mobile

**Record:**
- Timestamp: _______________
- Result: PASS / FAIL
- Notes: _______________

---

## Console Error Check

**Throughout all tests, monitor the browser console for:**

- JavaScript errors (red messages)
- Network errors (failed requests)
- React warnings
- Unhandled promise rejections

**Acceptable errors:**
- 404 responses for `/nonexistent-route-12345` (expected in Test 4)

**Unacceptable errors:**
- Any JavaScript runtime errors
- Failed asset loading (CSS, JS bundles)
- CORS errors
- Backend canister connection failures

**Record any errors found:**
- Error message: _______________
- Stack trace: _______________
- Steps to reproduce: _______________
- Test case where error occurred: _______________

---

## Network Request Check

**Throughout all tests, monitor the Network tab for:**

**Expected requests:**
- HTML document (200 OK)
- JavaScript bundles (200 OK)
- CSS files (200 OK)
- Backend canister queries (200 OK or expected error codes)

**Unacceptable failures:**
- Failed asset loading (404, 500)
- Timeout errors
- CORS errors

**Record any failed requests:**
- Request URL: _______________
- Status code: _______________
- Error message: _______________
- Test case where failure occurred: _______________

---

## Sign-Off

**Smoke Test Completed By:** _______________

**Date:** _______________

**Time:** _______________

**Overall Result:** PASS / FAIL

**Version Verified:** _______________

**Critical Issues Found:** _______________

**Non-Critical Issues Found:** _______________

**Approval for Production:** YES / NO

**Approver Name:** _______________

**Approver Signature:** _______________

---

## Troubleshooting

### If Error Boundary Appears

If you see the error boundary fallback UI (with "Something went wrong" and `data-error-marker="runtime-error-fallback"`):

1. **Capture the error message** displayed on screen
2. **Check browser console** for the full error stack trace
3. **Record the URL** where the error occurred
4. **Document steps to reproduce**
5. **Take screenshot** of error boundary UI
6. **Initiate rollback procedure** (see `production-promotion.md`)

### If Page Doesn't Load

1. Check Network tab for failed requests
2. Verify asset URLs are correct
3. Check for CORS errors
4. Verify backend canister is accessible
5. Clear cache and retry
6. Try different browser
7. Check DNS resolution (if DNS_PROBE_FINISHED_NXDOMAIN error)

### If Navigation Fails

1. Check console for routing errors
2. Verify URL structure matches expected routes
3. Test direct URL access vs. in-app navigation
4. Check for JavaScript errors blocking navigation
5. Verify React Router is functioning correctly

### If Version Label Shows Wrong Version

**This is a critical issue for rollback verification.**

1. **Clear browser cache completely:**
   - Chrome: Ctrl+Shift+Delete → "Cached images and files" → Clear data
   - Firefox: Ctrl+Shift+Delete → "Cache" → Clear Now
   - Safari: Develop → Empty Caches

2. **Perform hard reload:**
   - Chrome/Firefox: Ctrl+Shift+R
   - Safari: Cmd+Shift+R

3. **Verify CDN cache invalidation:**
   ```bash
   caffeine invalidate-cache --production --force
   ```

4. **Check deployment status:**
   ```bash
   caffeine status --production
   ```

5. **If version label still incorrect after cache clear:**
   - Document the issue
   - Contact deployment team
   - Do NOT approve production promotion
   - Investigate deployment pipeline

### If DNS Error Occurs (DNS_PROBE_FINISHED_NXDOMAIN)

**This is a network/DNS issue, not an application issue.**

**User-side fixes:**
1. Turn off VPN or security apps
2. Clear browser cache
3. Try different browser
4. Switch to mobile data (turn off WiFi)
5. Change DNS settings to Google DNS (8.8.8.8) or Cloudflare DNS (1.1.1.1)
6. Restart device

**Deployment-side verification:**
1. Verify domain is correctly configured
2. Check DNS propagation: `nslookup nehitha-thandal-customer-management-tool.icp.app`
3. Verify ICP boundary nodes are accessible
4. Test from different network/location

---

## Automated Verification (Optional)

For automated smoke testing, use the following selectors:

**Version label:**
