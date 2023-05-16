import fs from "fs/promises";
import { merge } from "lodash";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import defaultConfig from "./default";

const NOALBS_CONFIG_FILE = process.env.NOALBS_CONFIG_FILE!;
const NOALBS_CONFIG_DIR = path.dirname(NOALBS_CONFIG_FILE);

export async function GET(_request: NextRequest) {
  return NextResponse.json(await loadServerConfig());
}

export async function PUT(request: NextRequest) {
  // Load the config specified in the request body
  const requestConfig = await request.json();
  // TODO validate

  // Load the config that exists on the server, or the default if none exists
  let serverConfig = await loadServerConfig();

  // Merge the config objects
  const mergedConfig = merge({}, serverConfig, requestConfig);

  // Ensure the config path exists
  // Throws an error if the server process does not have permission to create
  // the directory
  await fs.mkdir(NOALBS_CONFIG_DIR, { recursive: true });

  // Overwrite the server config file with the merged data
  // Throws an error if the server process does not have permission to write to
  // the file
  await fs.writeFile(NOALBS_CONFIG_FILE, JSON.stringify(mergedConfig));

  // Respond with the merged data
  return NextResponse.json(mergedConfig);
}

async function loadServerConfig() {
  try {
    return JSON.parse((await fs.readFile(NOALBS_CONFIG_FILE)).toString("utf8"));
  } catch (_: any) {
    // If no server config exists, return the default config
    return defaultConfig;
  }
}
