#!/bin/bash
# Install script for irlss
# To be run as root on a Ubuntu 22.04 system
# Assumes the cwd is the root of the irlss repo
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

# Install nodejs v18 and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install nodejs

# Install the Remote Desktop Protocol (rdp) server
apt-get install -y xrdp
adduser xrdp ssl-cert

# Build the irlss docker images
docker compose build

# Build the webserver
cd webserver && npm install && npm run build && cd ..

# Register the systemd services
cp systemd/* /etc/systemd/system/
systemctl daemon-reload

# Start the services on boot
systemctl enable irlss-docker
systemctl enable irlss-webserver
systemctl enable xrdp

# Create unix user
adduser $1 --disabled-password --gecos ""
adduser $1 sudo
echo "$1:ubuntu" | chpasswd

# Install to user's home directory
sudo -u $1 cp -r home /home/$1

# Restart server
reboot
