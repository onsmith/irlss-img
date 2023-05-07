##
# Dockerfile for creating the noalbs image
#

# Build image
FROM rust:slim-buster as build

# Install dependencies
RUN apt-get update -y
RUN apt-get install -y git libssl-dev pkg-config

# Build from source
WORKDIR /app
RUN git clone https://github.com/715209/nginx-obs-automatic-low-bitrate-switching .
RUN cargo build --release

# Final image
FROM debian:buster-slim

# Install dependencies
RUN apt-get update -y
RUN apt-get install -y libssl-dev

# Copy in the compiled artifacts from the build stage
COPY --from=build /app/target/release/noalbs /usr/local/bin/

# Create a new unix user that will run the server
RUN adduser noalbs
USER noalbs
WORKDIR /home/noalbs

# Copy config
COPY config.json .

# Entrypoint -- run noalbs
ENTRYPOINT ["noalbs"]
