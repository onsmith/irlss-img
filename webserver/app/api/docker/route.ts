import assert from "assert";
import child_process from "child_process";
import { NextRequest, NextResponse } from "next/server";
import util from "util";

// Wrap child_process.exec() in a promise
const exec = util.promisify(child_process.exec);

// Get the path to the docker-compose directory from the environment
const DOCKER_COMPOSE_DIR = process.env.DOCKER_COMPOSE_DIR!;

const serviceNames = ["srt-relay", "srt-receiver", "noalbs"];

export async function GET(_request: NextRequest) {
  try {
    const { stdout } = await exec("docker compose ps --all --format json", {
      cwd: DOCKER_COMPOSE_DIR,
    });
    const services = JSON.parse(stdout);
    assert(Array.isArray(services));

    return NextResponse.json({
      services: filterServices(services),
      message: undefined,
    });
  } catch (error: any) {
    return NextResponse.json({
      services: serviceNames.map((name) => ({
        id: name,
        name,
        state: "unknown",
        status: "unknown",
      })),
      message: error.stderr || error.message,
    });
  }
}

function filterServices(services: any[]) {
  const serviceMap: Record<string, any> = {};

  // Fill serviceMap with default services
  for (const serviceName of serviceNames) {
    serviceMap[serviceName] = {
      id: serviceName,
      name: serviceName,
      state: "offline",
      status: "unknown",
    };
  }

  // Merge in services from docker compose
  for (const service of services) {
    if (service.Service in serviceMap) {
      serviceMap[service.Service] = {
        id: service.ID,
        name: service.Service,
        state: service.State,
        status: service.Status.toLowerCase(),
      };
    }
  }

  // Convert to array and return
  return Object.values(serviceMap);
}
