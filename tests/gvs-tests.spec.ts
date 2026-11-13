import { expect, test } from '@playwright/test';

test.describe('GVS Configuration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gvs-config');
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
  });

  test('loads the page', async ({ page }) => {
    await expect(page.getByText('Generalised Vertical Section Config')).toBeVisible();
    await page.getByRole('button', { name: 'Actions' }).click();
    await expect(page.getByTestId('upload-button')).toBeVisible();
    await expect(page.getByTestId('clear-button')).toBeVisible();
    await expect(page.getByTestId('download-button')).toBeVisible();
    await expect(page.getByTestId('add-layer-button')).toBeVisible();
  });

  test('adds a layer', async ({ page }) => {
    await expect(page.getByText('GVS Layers: 0')).toBeVisible();
    await page.getByTestId('add-layer-button').click();
    await expect(page.getByText('GVS Layers: 1')).toBeVisible();
  });

  test('adds only one layer per click', async ({ page }) => {
    await page.getByTestId('add-layer-button').click();
    await expect(page.getByRole('row')).toHaveCount(2); // header + 1 data row
  });

  test('clears all layers', async ({ page }) => {
    await page.getByTestId('add-layer-button').click();
    await page.getByTestId('add-layer-button').click();
    await expect(page.getByText('GVS Layers: 2')).toBeVisible();
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByTestId('clear-button').click();
    await expect(page.getByText('GVS Layers: 0')).toBeVisible();
    await expect(page.getByText('GVS Config Cleared')).toBeVisible();
  });

  test('uploads a valid gvs file', async ({ page }) => {
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByTestId('upload-input').setInputFiles('tests/fixtures/layer_config.txt');
    await expect(page.locator('h6')).toContainText('GVS Layers: 26');
  });

  test('rejects non txt upload', async ({ page }) => {
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByTestId('upload-input').setInputFiles({
      name: 'test.json',
      mimeType: 'application/json',
      buffer: Buffer.from('{}'),
    });

    await expect(page.locator('h6')).toContainText('GVS Layers: 0');
    await expect(page.getByText('Please upload a valid TEXT file (.txt)')).toBeVisible();
  });

  test('downloads configuration', async ({ page }) => {
    await page.getByTestId('add-layer-button').click();
    await page.getByRole('button', { name: 'Actions' }).click();
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('download-button').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('layer_config.txt');
  });

  test('deletes a layer', async ({ page }) => {
    await page.getByTestId('add-layer-button').click();
    await expect(page.getByText('GVS Layers: 1')).toBeVisible();
    await page.getByRole('button').nth(3).click();
    await expect(page.getByText('GVS Layers: 0')).toBeVisible();
  });
});
