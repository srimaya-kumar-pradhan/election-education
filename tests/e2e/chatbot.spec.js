const { test, expect } = require('@playwright/test');

test.describe('Chatbot E2E Flow', () => {
  test('Should require sign in to access chat', async ({ page }) => {
    await page.goto('/chat');
    
    // Check for the sign in gate
    const signInButton = page.locator('#chat-sign-in');
    await expect(signInButton).toBeVisible();
    await expect(signInButton).toHaveText(/Sign In to Start Chatting/i);
  });
});
