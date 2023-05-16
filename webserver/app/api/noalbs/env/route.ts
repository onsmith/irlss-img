import dotenv from "dotenv";
import fs from "fs/promises";
import { merge } from "lodash";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import defaultEnv from "./default";

const NOALBS_ENV_FILE = process.env.NOALBS_ENV_FILE!;
const NOALBS_ENV_DIR = path.dirname(NOALBS_ENV_FILE);

export async function GET(_request: NextRequest) {
  return NextResponse.json(await loadServerEnv());
}

export async function PUT(request: NextRequest) {
  // Load the env specified in the request body
  const requestEnv = request.body;
  // TODO validate

  // Load the env that exists on the server, or the default if none exists
  let serverEnv = await loadServerEnv();

  // Merge the env objects
  const mergedEnv = merge({}, serverEnv, requestEnv);

  // Ensure the env path exists
  // Throws an error if the server process does not have permission to create
  // the directory
  await fs.mkdir(NOALBS_ENV_DIR, { recursive: true });

  // Overwrite the server env file with the merged data
  // Throws an error if the server process does not have permission to write to
  // the file
  await fs.writeFile(
    NOALBS_ENV_FILE,
    Object.entries(mergedEnv)
      .map(([key, value]) => `${key}=${value}\n`)
      .join("")
  );

  // Respond with the merged data
  return NextResponse.json(mergedEnv);
}

async function loadServerEnv() {
  try {
    return dotenv.parse((await fs.readFile(NOALBS_ENV_FILE)).toString("utf8"));
  } catch (_: any) {
    // If no server env exists, return the default env
    return defaultEnv;
  }
}
