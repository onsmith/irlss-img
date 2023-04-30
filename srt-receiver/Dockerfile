##
# Dockerfile for creating the srt-receiver image
#

# Build image
FROM alpine:3.15 as build

# Install dependencies
# For reproducability, don't update/upgrade packages
# RUN apk update && apk upgrade
RUN apk add --no-cache \
    linux-headers \
    alpine-sdk \
    cmake \
    tcl \
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

# Clone and compile the belabox srtla connection bonding server
# Produced artifacts:
#   /app/srtla/srtla_rec
#   /app/srtla/srtla_send
# Since we're building the receiver docker image, only srtla_rec is needed
WORKDIR /app
RUN git clone https://github.com/BELABOX/srtla.git
WORKDIR /app/srtla
RUN make

# Final image
FROM alpine:3.15

# Install dependencies
# For reproducability, don't update/upgrade packages
# RUN apk update && apk upgrade
RUN apk add --no-cache openssl libstdc++

# Copy in the compiled artifacts from the build stage
COPY --from=build /app/srt/out/. /
COPY --from=build /app/srtla/srtla_rec /usr/local/bin/

# Create a new unix user that will run the server
RUN adduser -D srtla
USER srtla
WORKDIR /home/srtla

# Belabox (the upstream producer) pushes the stream to this port
EXPOSE "49001:49001/udp"

# Run srtla_rec
# first positional argument  - the upstream listening port
# second positional argument - the bonded stream will be pushed downstream to this domain name
# third positional argument  - the bonded stream will be pushed downstream to this port
ENTRYPOINT ["srtla_rec", "49001", "srt-relay", "49002"]
