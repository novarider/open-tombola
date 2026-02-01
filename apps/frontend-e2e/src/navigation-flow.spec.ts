import { test } from '@playwright/test';

test.describe('Navigation and User Flow', () => {
  test.skip('should complete a full user journey through the app', async ({
    page,
  }) => {
    // Start at home page
    await page.goto('/');

    // todo write test cases for open-tombola
  });
});
