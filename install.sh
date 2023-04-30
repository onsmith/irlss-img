#!/bin/bash
# Install script for irlserver
# To be run as root on a Ubuntu 22.04 system
# Assumes the cwd is the root of the irlserver repo
# Pass the name of the user to create as the first argument

# Configure bash
set -euox pipefail

# Update the package manager
apt-get update -y

# Install tools that will be used to install the applications below
apt-get install -y \
    software-properties-common \
    curl \
    apt-transport-https \
    ca-certificates

# Install docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
apt-cache policy docker-ce
apt-get install -y docker-ce

# Install obs
add-apt-repository ppa:obsproject/obs-studio
apt-get install -y obs-studio

# Install gnome
apt-get install -y ubuntu-desktop-minimal

# Install the Remote Desktop Protocol (rdp) server
apt-get install -y xrdp
adduser xrdp ssl-cert

# Build the irlserver docker images
docker compose build

# Register the irlserver service with systemd
cp irlserver.service /etc/systemd/system/
systemctl daemon-reload

# Start the services on boot
systemctl enable irlserver
systemctl enable xrdp

# Create unix user
adduser $1
adduser $1 sudo
echo "$1:ubuntu" | chpasswd

# Set up user's home directory
sudo -u $1 cp -r home /home/$1

# Restart server
reboot
