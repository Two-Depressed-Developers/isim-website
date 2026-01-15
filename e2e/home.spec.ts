import { test, expect } from '@playwright/test';

test('Home page loads', async ({ page }) => {
  await page.goto('/pl');
  await expect(page).toHaveTitle(/ISIM/i); 

  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
});
