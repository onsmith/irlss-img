#!/bin/bash
# Install script for irlss
# To be run as root on a Ubuntu 22.04 system
# Assumes the cwd is the root of the irlss repo
# Pass the name of the user to create as the first argument

# Configure bash
set -euox pipefail

# Early exit if the install path is non-empty

# Update the package manager
apt-get update -y

# Install tools that will be used to install the applications below
apt-get install -y -qq \
    software-properties-common \
    curl \
    apt-transport-https \
    ca-certificates \
    sudo

# Configure package manager to install docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
apt-cache policy docker-ce

# Configure package manager to install obs
add-apt-repository ppa:obsproject/obs-studio

# Configure package manager to install nodejs and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

# Install dependencies
apt-get install -y -qq \
    docker-ce \
    obs-studio \
    ubuntu-desktop-minimal \
    nodejs \
    xrdp

# The xrdp user needs to be in the ssl-cert group
usermod -a -G ssl-cert xrdp

# Build the irlss docker images
(cd docker; docker compose build -q) &

# Build the webserver
(cd webserver; npm install && npm run build) &

# Wait for the builds to finish
wait

# Register the systemd services
cp systemd/* /etc/systemd/system/
systemctl daemon-reload

# Start the services on boot
systemctl enable xrdp
systemctl enable irlss-docker
systemctl enable irlss-webserver

# Create the unix user
useradd --create-home --shell /bin/bash -G sudo $1
echo "$1:ubuntu" | chpasswd

# Set up the user's home directory
sudo -u $1 cp -r home /home/$1

# Restart server
reboot
