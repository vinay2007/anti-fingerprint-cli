$ErrorActionPreference = 'Stop'

Write-Host "Uninstalling Anti-Fingerprint CLI for Windows..." -ForegroundColor Red

# Remove global command
try {
    Write-Host "Removing global npm link..." -ForegroundColor Blue
    npm uninstall -g anti-fingerprint
} catch {
    Write-Host "Global command already removed or failed to remove." -ForegroundColor Yellow
}

# Remove installation directory
$installDir = Join-Path $HOME ".anti-fingerprint-cli"
if (Test-Path $installDir) {
    Write-Host "Removing installation directory..." -ForegroundColor Blue
    Remove-Item -Recurse -Force $installDir
}

# Remove config and profile data
$configDir = Join-Path $HOME ".anti-fingerprint"
if (Test-Path $configDir) {
    Write-Host "Removing configuration and profile data..." -ForegroundColor Blue
    Remove-Item -Recurse -Force $configDir
}

Write-Host "Anti-Fingerprint has been fully removed from your system." -ForegroundColor Green
