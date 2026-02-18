# Production Promotion Runbook

This document outlines the steps to promote a specific draft build (including rollback to Draft Version 14) to the live production environment for the Nehitha Thandal Management application.

## Prerequisites

- Draft build has been tested and approved
- All smoke tests have passed (see `smoke-test-live.md`)
- Backend canister is deployed and stable
- Admin access to deployment infrastructure
- Caffeine CLI installed and authenticated

## Frontend Promotion Steps

### 1. Identify the Target Draft Version

Before promoting, confirm which draft version you want to make live:

