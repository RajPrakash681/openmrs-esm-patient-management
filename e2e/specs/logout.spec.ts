import { expect } from '@playwright/test';
import { test } from '../core';

test('Admin user can logout successfully', async ({ page }) => {
  await test.step('When I navigate to the home page', async () => {
    await page.goto('home');
  });

  await test.step('Then I should see the user menu', async () => {
    // Wait for page to be fully loaded
    await page.waitForLoadState('load');

    // Look for the user menu button (commonly an avatar or user icon)
    const userMenuButton = page
      .getByRole('button', { name: /user/i })
      .or(page.locator('[data-testid="userMenuButton"]'))
      .or(page.locator('button[aria-label*="User"]'));

    await expect(userMenuButton).toBeVisible({ timeout: 10000 });
    await userMenuButton.click();
  });

  await test.step('And I click on the Logout button', async () => {
    // Ensure the logout button is visible before clicking
    const logoutButton = page
      .getByRole('button', { name: /logout/i })
      .or(page.getByRole('menuitem', { name: /logout/i }));

    await expect(logoutButton).toBeVisible({ timeout: 10000 });
    await logoutButton.click();
  });

  await test.step('Then I should be redirected to the login page', async () => {
    // Wait for navigation to complete
    await page.waitForURL(/login/, { timeout: 10000 });

    // Verify we're on the login page
    await expect(page).toHaveURL(/login/);

    // Verify login form elements are visible
    await expect(
      page.getByRole('textbox', { name: /username/i }).or(page.locator('input[name="username"]')),
    ).toBeVisible({ timeout: 5000 });
  });

  await test.step('And the session should be cleared', async () => {
    // Try to navigate back to a protected page
    await page.goto('home');

    // Should redirect back to login
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
  });
});
