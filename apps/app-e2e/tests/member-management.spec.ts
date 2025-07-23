import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Member Management', () => {
  // Test user credentials from environment variables or defaults
  const testUser = {
    email: process.env.TEST_USER_EMAIL || 'admin@example.com',
    password: process.env.TEST_USER_PASSWORD || 'password123',
  };

  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('/login');

    // Login before each test
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Wait for navigation to complete after login
    await page.waitForURL('**/dashboard');
  });

  test('should allow adding a new member', async ({ page }) => {
    // Navigate to members page
    await page.click('text=Members');
    await expect(page).toHaveURL(/\/members$/);

    // Click the "Add Member" button
    await page.click('button:has-text("Add Member")');
    await expect(page).toHaveURL(/\/members\/new$/);

    // Generate test data
    const memberData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      postalCode: faker.location.zipCode(),
      country: faker.location.country(),
      dateOfBirth: '1990-01-01',
      gender: 'male',
      status: 'active',
      role: 'Member',
      notes: 'Test member created by E2E test',
    };

    // Fill out the member form
    await page.fill('input[name="firstName"]', memberData.firstName);
    await page.fill('input[name="lastName"]', memberData.lastName);
    await page.fill('input[name="email"]', memberData.email);
    await page.fill('input[name="phone"]', memberData.phone);
    await page.fill('textarea[name="address"]', memberData.address);
    await page.fill('input[name="city"]', memberData.city);
    await page.fill('input[name="state"]', memberData.state);
    await page.fill('input[name="postalCode"]', memberData.postalCode);
    await page.fill('input[name="country"]', memberData.country);

    // Fill date of birth (assuming you're using a date picker)
    await page.fill('input[name="dateOfBirth"]', memberData.dateOfBirth);

    // Select gender
    await page.selectOption('select[name="gender"]', memberData.gender);

    // Select status
    await page.click('button[role="combobox"]');
    await page.click(`text=${memberData.status}`);

    // Select role
    await page.click('button[role="combobox"]');
    await page.click(`text=${memberData.role}`);

    // Fill notes
    await page.fill('textarea[name="notes"]', memberData.notes);

    // Submit the form
    await page.click('button:has-text("Save Member")');

    // Wait for navigation to the members list
    await page.waitForURL('**/members');

    // Verify success message
    await expect(
      page.locator('text=Member created successfully')
    ).toBeVisible();

    // Verify the new member appears in the list
    await expect(
      page.locator('table').locator(`tr:has-text("${memberData.email}")`)
    ).toBeVisible();
  });

  test('should display validation errors for required fields', async ({
    page,
  }) => {
    // Navigate to new member form
    await page.goto('/members/new');

    // Try to submit the form without filling any fields
    await page.click('button:has-text("Save Member")');

    // Verify validation error messages
    await expect(page.locator('text=First name is required')).toBeVisible();
    await expect(page.locator('text=Last name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Status is required')).toBeVisible();
    await expect(page.locator('text=Role is required')).toBeVisible();
  });

  test('should allow editing an existing member', async ({ page }) => {
    // Navigate to members page
    await page.goto('/members');

    // Click the first member's edit button
    const firstMemberRow = page.locator('table tbody tr').first();
    await firstMemberRow.locator('button:has-text("Edit")').click();

    // Wait for the edit form to load
    await expect(page).toHaveURL(/\/members\/[^/]+\/edit$/);

    // Update the member's information
    const updatedLastName = `Updated-${Date.now()}`;
    await page.fill('input[name="lastName"]', updatedLastName);

    // Submit the form
    await page.click('button:has-text("Update Member")');

    // Wait for navigation back to the members list
    await page.waitForURL('**/members');

    // Verify success message
    await expect(
      page.locator('text=Member updated successfully')
    ).toBeVisible();

    // Verify the member's information was updated in the list
    await expect(
      page.locator('table').locator(`tr:has-text("${updatedLastName}")`)
    ).toBeVisible();
  });

  test('should allow deleting a member', async ({ page }) => {
    // Navigate to members page
    await page.goto('/members');

    // Get the first member's name for verification
    const firstMemberRow = page.locator('table tbody tr').first();
    const memberName = await firstMemberRow
      .locator('td:nth-child(2)')
      .textContent();

    // Click the delete button for the first member
    await firstMemberRow.locator('button:has-text("Delete")').click();

    // Confirm the deletion in the confirmation dialog
    await page.click('button:has-text("Delete")');

    // Wait for the member to be removed from the list
    await expect(page.locator(`text=${memberName}`)).not.toBeVisible();

    // Verify success message
    await expect(
      page.locator('text=Member deleted successfully')
    ).toBeVisible();
  });

  test('should allow searching for members', async ({ page }) => {
    // Navigate to members page
    await page.goto('/members');

    // Get the first member's name for searching
    const firstMemberRow = page.locator('table tbody tr').first();
    const memberName = await firstMemberRow
      .locator('td:nth-child(2)')
      .textContent();

    if (!memberName) {
      // Skip the test if there are no members
      test.skip(!memberName, 'No members found to search for');
      return;
    }

    // Type the member's name in the search input
    await page.fill('input[placeholder="Search members..."]', memberName);

    // Wait for the search to complete (you might need to adjust the selector based on your implementation)
    await page.waitForTimeout(500);

    // Verify that the member is still visible in the filtered results
    await expect(page.locator('table tbody tr')).toHaveCount(1);
    await expect(page.locator('table')).toContainText(memberName);

    // Clear the search
    await page.fill('input[placeholder="Search members..."]', '');

    // Verify that all members are visible again
    const rowCount = await page.locator('table tbody tr').count();
    expect(rowCount).toBeGreaterThan(1);
  });
});
