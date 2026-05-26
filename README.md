# Anti-Fingerprint CLI

A globally installable CLI-based browser privacy protection tool.

## Features

* **Zero Configuration:** Install and start browsing with protection immediately.
* **Canvas Protection:** Normalizes pixel output to prevent canvas fingerprinting.
* **WebGL Protection:** Standardizes GPU vendor and renderer information.
* **Navigator Masking:** Overrides hardware concurrency, memory, and platform properties.
* **WebRTC Protection:** Prevents IP leaks by stripping ICE servers.
* **Audio & Font Protection:** Reduces entropy from hardware-based fingerprinting.
* **Isolated Profile:** Uses a dedicated browser profile for all sessions.

## Installation

One-command installation for Linux and macOS:

```bash
curl -fsSL https://raw.githubusercontent.com/USERNAME/anti-fingerprint-cli/main/install.sh | bash
```

## Usage

### Start Protection

Launch the browser with protection:

```bash
anti-fingerprint
```

Run in background:

```bash
anti-fingerprint -d
```

### Stop Protection

Close the protected browser session:

```bash
anti-fingerprint stop
```

### Check Status

Verify if protection is ready:

```bash
anti-fingerprint status
```

### Run Tests

Open common fingerprint testing websites:

```bash
anti-fingerprint test
```

### Uninstall

Completely remove the tool and all data:

```bash
anti-fingerprint uninstall
```

## Technical Stack

* **Runtime:** Node.js
* **Engine:** Playwright (Chromium/Edge)
* **Protection:** Manifest V3 Browser Extension
* **UI:** chalk, ora, figlet, boxen

## Privacy Policy

* **No Telemetry:** We do not collect any data.
* **Full Local:** Everything runs on your machine.
* **No Cloud:** Zero external dependencies for operation.
