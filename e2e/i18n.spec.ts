import { test, expect } from '@playwright/test';

test('Locale switching', async ({ page }) => {
  await page.goto('/pl');
  await expect(page.locator('header')).toContainText(/Kadra/i);

  await page.goto('/en');
  
  await expect(page.locator('header')).toContainText(/Staff/i);
  await expect(page.locator('h2')).toContainText(/Our Supervisors/i);
});
