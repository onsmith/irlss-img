##
# Dockerfile for creating the srt-relay image
#

# Build image
FROM alpine:3.15 as build

# Install dependencies
# For reproducability, don't update/upgrade packages
# RUN apk update && apk upgrade
RUN apk add --no-cache \
    linux-headers \
    alpine-sdk \
    cmake tcl \
    openssl-dev \
    zlib-dev

# Clone, compile, and install the modified srt library
# Implements the SRT protocol but with minor changes to better suit connection bonding
# Vanilla SRT library: https://github.com/Haivision/srt
# Fork number 1:       https://github.com/BELABOX/srt
# Fork number 2:       https://github.com/onsmith/srt
WORKDIR /app
RUN git clone https://github.com/onsmith/srt.git
WORKDIR /app/srt
RUN ./configure && make DESTDIR=out install && cp out/. / -r

# Clone and compile the forked srt-live-server (sls)
# We use the forked one because it is compatible with NOALBS
# See: https://github.com/715209/nginx-obs-automatic-low-bitrate-switching#using-sls-srt-live-server
# Original sls application:    https://github.com/Edward-Wu/srt-live-server
# Fork that works with NOALBS: https://gitlab.com/mattwb65/srt-live-server
WORKDIR /app
RUN git clone https://gitlab.com/mattwb65/srt-live-server.git
WORKDIR /app/srt-live-server
RUN make


# Final image
FROM alpine:3.15

# Install dependencies
# For reproducability, don't update/upgrade packages
# RUN apk update && apk upgrade
RUN apk add --no-cache \
    openssl \
    libstdc++

# Copy in the compiled artifacts from the build stage
COPY --from=build /app/srt/out/. /
COPY --from=build /app/srt-live-server/bin/* /usr/local/bin/

# Create a new unix user that will run the server
RUN adduser -D sls
USER sls
WORKDIR /home/sls

# The srt-receiver pushes the stream to this port
# Downstream consumers pull the stream from this port
EXPOSE 49002/udp

# NOALBS pulls stream stats from this port
EXPOSE 8080/tcp

# Run sls
# This will automatically pick up sls.conf if it's in the cwd
ENTRYPOINT ["sls"]
