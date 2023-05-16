import Ajv from "ajv";
import child_process from "child_process";
import { NextRequest, NextResponse } from "next/server";
import util from "util";

// Wrap child_process.exec() in a promise
const exec = util.promisify(child_process.exec);

// Get the path to the docker-compose directory from the environment
const DOCKER_COMPOSE_DIR = process.env.DOCKER_COMPOSE_DIR!;

// Validation schema
const ajv = new Ajv();
const validate = ajv.compile({
  type: "object",
  properties: {
    action: {
      type: "string",
      enum: ["restart", "up", "down", "pause", "unpause"],
    },
    services: {
      type: "array",
      items: {
        type: "string",
        enum: ["srt-relay", "srt-receiver", "noalbs"],
      },
      uniqueItems: true,
    },
  },
  required: ["action", "services"],
  additionalProperties: false,
});

interface RequestData {
  action: string;
  services: string[];
}

export async function POST(request: NextRequest) {
  // Load the request data
  const data: RequestData = await request.json();

  // Validate the request data
  if (!validate(data)) {
    return NextResponse.json({
      message: validate.errors?.join("\n"),
    });
  }

  // These commands don't take a service name
  if (["up", "down"].includes(data.action)) {
    data.services = [];
  }

  // Run up in a daemon
  if (data.action === "up") {
    data.action = "up -d";
  }

  try {
    await exec(`docker compose ${data.action} ${data.services.join(" ")}`, {
      cwd: DOCKER_COMPOSE_DIR,
    });
  } catch (error: any) {
    return NextResponse.json({
      message: error.stderr || error.message,
    });
  }

  return NextResponse.json({
    message: undefined,
  });
}
