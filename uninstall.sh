#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${RED}Uninstalling Anti-Fingerprint CLI...${NC}"

# Remove global command
sudo rm -f /usr/local/bin/anti-fingerprint

# Remove installation directory
rm -rf "$HOME/.anti-fingerprint-cli"

# Remove config and profile data
rm -rf "$HOME/.anti-fingerprint"

echo -e "${GREEN}Anti-Fingerprint has been fully removed.${NC}"
