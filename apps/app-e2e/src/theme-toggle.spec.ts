import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to be fully loaded
    await page.waitForSelector('body');
  });

  test('should toggle between light and dark mode', async ({ page }) => {
    // Check if the theme toggle button is visible
    const themeToggle = page.getByTestId('theme-toggle');
    await expect(themeToggle).toBeVisible();

    // Check initial theme (should be system or light by default)
    const isDarkMode = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    // Click the theme toggle to open the menu
    await themeToggle.click();

    // Wait for the theme menu to be visible
    const lightOption = page.getByTestId('light-theme-option');
    const darkOption = page.getByTestId('dark-theme-option');
    const systemOption = page.getByTestId('system-theme-option');

    await expect(lightOption).toBeVisible();
    await expect(darkOption).toBeVisible();
    await expect(systemOption).toBeVisible();

    // Test switching to dark mode
    await darkOption.click();

    // Verify dark mode is applied
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Reopen the menu and switch to light mode
    await themeToggle.click();
    await lightOption.click();

    // Verify light mode is applied
    await expect(page.locator('html')).not.toHaveClass(/dark/);

    // Test system preference
    await themeToggle.click();
    await systemOption.click();

    // The class should match the system preference
    const prefersDark = await page.evaluate(
      () => window.matchMedia('(prefers-color-scheme: dark)').matches
    );

    if (prefersDark) {
      await expect(page.locator('html')).toHaveClass(/dark/);
    } else {
      await expect(page.locator('html')).not.toHaveClass(/dark/);
    }
  });

  test('should persist theme preference', async ({ page }) => {
    // Set to dark mode
    await page.goto('/');
    const themeToggle = page.getByTestId('theme-toggle');
    await themeToggle.click();
    await page.getByTestId('dark-theme-option').click();

    // Verify dark mode is applied
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Reload the page
    await page.reload();

    // Theme preference should persist
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});
