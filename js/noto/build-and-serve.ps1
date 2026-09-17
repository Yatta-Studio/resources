Write-Host "Building the project..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Aborting." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "Navigating to dist/noto..." -ForegroundColor Cyan
Set-Location dist/noto

Write-Host "Starting local server..." -ForegroundColor Green
npx serve