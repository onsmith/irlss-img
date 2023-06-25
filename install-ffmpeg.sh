#!/bin/bash
# Install script for dynamically-linked ffmpeg with srt library enabled
# To be run as root on a Ubuntu 22.04 system

# Configure bash
set -euo pipefail

# Make a temporary working directory
WORKDIR=$(mktemp -d)

# Install precompiled dependencies
apt-get update -qq
DEBIAN_FRONTEND=noninteractive apt-get -y install \
  build-essential \
  git \
  cmake \
  libssl-dev \
  tcl \
  wget \
  yasm \
  libfdk-aac-dev \
  libmp3lame-dev \
  libopus-dev \
  libvorbis-dev \
  libvpx-dev \
  libx264-dev \
  libx265-dev

# Download, compile, and install srt from source
mkdir -p "$WORKDIR/srt"
cd "$WORKDIR/srt"
git clone https://github.com/Haivision/srt .
./configure
make -j$(nproc)
make install

# Download and unzip ffmpeg source
mkdir -p "$WORKDIR/ffmpeg"
cd "$WORKDIR/ffmpeg"
wget -O ffmpeg-snapshot.tar.bz2 https://ffmpeg.org/releases/ffmpeg-snapshot.tar.bz2
tar xjvf ffmpeg-snapshot.tar.bz2

# Configure ffmpeg build
cd "$WORKDIR/ffmpeg/ffmpeg"
./configure \
  --disable-static \
  --enable-shared \
  --extra-libs="-lpthread -lm" \
  --enable-gpl \
  --enable-nonfree \
  --enable-libfdk-aac \
  --enable-libmp3lame \
  --enable-libopus \
  --enable-libvorbis \
  --enable-libvpx \
  --enable-libx264 \
  --enable-libx265 \
  --enable-openssl \
  --enable-libsrt

# Compile and install ffmpeg
cd "$WORKDIR/ffmpeg/ffmpeg"
make -j$(nproc)
make install

# Refresh the dynamic linker cache
ldconfig
