# Anti-Fingerprint CLI (v1.0.0)

A globally installable CLI-based browser privacy protection tool developed by **vinay2007**.

## Why We Built It This Way

Traditional privacy tools often try to patch your existing browser profiles. This is risky because:
1. It can break your saved passwords, bookmarks, and site preferences.
2. It is easily detectable by websites because it leaves "fingerprint artifacts" in your main profile.

**Anti-Fingerprint CLI** uses an **Isolated Sandbox Architecture**. Every time you run the tool, it launches a completely separate, hardened browser instance with a dedicated profile. This ensures your main data remains safe while giving you a fresh, anonymized environment for private browsing.

## How It Works

1. **Isolated Profile**: The CLI creates a unique user data directory that is separate from your default Chrome/Edge.
2. **Hardened Launch**: The browser is launched with over 30 privacy-focused flags that disable background tracking and telemetry.
3. **Extension Injection**: A bundled Manifest V3 extension is automatically loaded. This extension hooks into critical browser APIs (Canvas, WebGL, Audio, etc.) at `document_start` to mask your hardware and software identity.
4. **Local Execution**: Zero data ever leaves your machine. No telemetry, no cloud, no analytics.

## Installation

### Linux & macOS

```bash
curl -fsSL https://raw.githubusercontent.com/vinay2007/anti-fingerprint-cli/master/install.sh | bash
```

### Windows

Run in PowerShell:

```powershell
iex (irm 'https://raw.githubusercontent.com/vinay2007/anti-fingerprint-cli/master/install.ps1')
```

## Usage

### Start Protection

Launch the protected browser:

```bash
anti-fingerprint
```

### Stop Protection

```bash
anti-fingerprint stop
```

### Run Tests

Verify your protection against common fingerprinting sites:

```bash
anti-fingerprint test
```

## Limitations

* **Scope**: Protection is **ONLY** active within the browser window opened by the CLI. Your normal browser remains unprotected.
* **Session Persistence**: Closing the browser window or stopping the CLI ends the protection session.
* **No 100% Anonymity**: While this tool significantly reduces your fingerprint uniqueness (entropy), advanced fingerprinting may still find ways to track you. Use this as part of a broader privacy strategy.

## License

Created by **vinay2007**. Distributed under the MIT License. See [LICENSE](LICENSE) for details.
