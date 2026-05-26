$ErrorActionPreference = 'Stop'

Write-Host "Installing Anti-Fingerprint CLI for Windows..." -ForegroundColor Cyan

# Check Node.js
try {
    $nodeVersion = node -v
    Write-Host "Detected Node.js: $nodeVersion" -ForegroundColor Blue
} catch {
    Write-Host "Error: Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Create installation directory
$installDir = Join-Path $HOME ".anti-fingerprint-cli"
if (Test-Path $installDir) {
    Remove-Item -Recurse -Force $installDir
}
New-Item -ItemType Directory -Path $installDir | Out-Null

# Clone repository
Write-Host "Downloading files from GitHub..." -ForegroundColor Blue
git clone --quiet https://github.com/vinay2007/anti-fingerprint-cli.git $installDir

Set-Location $installDir

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Blue
npm install --silent

# Install Playwright browsers
Write-Host "Installing browser binaries..." -ForegroundColor Blue
npx playwright install chromium

# Register global command using npm link
Write-Host "Registering global command..." -ForegroundColor Blue
npm link

Write-Host ""
Write-Host "#############################################" -ForegroundColor Green
Write-Host "#                                           #" -ForegroundColor Green
Write-Host "#  Anti-Fingerprint Installed Successfully!  #" -ForegroundColor Green
Write-Host "#                                           #" -ForegroundColor Green
Write-Host "#############################################" -ForegroundColor Green
Write-Host ""
Write-Host "Run 'anti-fingerprint' in a new terminal to begin."
