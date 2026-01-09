import { test, expect } from '@playwright/test';

test('Accessing panel redirects to login', async ({ page }) => {
  await page.goto('/panel');
  
  await expect(page).not.toHaveURL(/.*\/panel$/, { timeout: 15000 });
  await expect(page).toHaveURL(/.*\/login.*/);
});
