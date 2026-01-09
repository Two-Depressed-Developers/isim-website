import { test, expect } from '@playwright/test';

test('Staff list loads', async ({ page }) => {
  await page.goto('/pl/staff');
  
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('main')).toBeVisible();
  
  await expect(page.locator('main')).toContainText(/Jan Kowalski/i);
});

test('404 Page displays for unknown routes', async ({ page }) => {
  await page.goto('/pl/non-existent-page-123');
  
  await expect(page.locator('body')).toContainText(/404/i);
});
