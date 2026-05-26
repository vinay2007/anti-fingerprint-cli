#!/bin/bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}Installing Anti-Fingerprint CLI...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Detect OS
OS="$(uname)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    CYGWIN*)    MACHINE=Cygwin;;
    MINGW*)     MACHINE=MinGw;;
    *)          MACHINE="UNKNOWN:${OS}"
esac

echo -e "${BLUE}Detected OS: ${MACHINE}${NC}"

# Create installation directory
INSTALL_DIR="$HOME/.anti-fingerprint-cli"
rm -rf "$INSTALL_DIR"
mkdir -p "$INSTALL_DIR"

# Clone repository
echo -e "${BLUE}Downloading files from GitHub...${NC}"
git clone --quiet https://github.com/vinay2007/anti-fingerprint-cli.git "$INSTALL_DIR"

cd "$INSTALL_DIR"

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install --silent

# Install Playwright browsers
echo -e "${BLUE}Installing browser binaries...${NC}"
npx playwright install chromium

# Create symbolic link for global access
echo -e "${BLUE}Registering global command...${NC}"
sudo ln -sf "$INSTALL_DIR/src/cli/index.js" /usr/local/bin/anti-fingerprint
sudo chmod +x /usr/local/bin/anti-fingerprint

echo -e "${GREEN}"
echo "#############################################"
echo "#                                           #"
echo "#  Anti-Fingerprint Installed Successfully!  #"
echo "#                                           #"
echo "#############################################"
echo -e "${NC}"
echo "Run 'anti-fingerprint' to begin."
