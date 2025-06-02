#!/usr/bin/env node

import { Command } from "commander"
import chalk from "chalk"
import { addCommand } from "./commands/add.js"
import { initCommand } from "./commands/init.js"
import { buildCommand } from "./commands/build.js"
import { scanCommand } from "./commands/scan.js"

const program = new Command()

program
  .name("buildy")
  .description("A CLI for adding UI components to your Vite React projects (UI8Kit utility components)")
  .version("1.0.0")

program
  .command("init")
  .description("Initialize UI8Kit structure in your project")
  .option("-y, --yes", "Skip prompts and use defaults")
  .action(initCommand)

program
  .command("add")
  .description("Add utility components to your project")
  .argument("[components...]", "Components to add")
  .option("-a, --all", "Install all available components")
  .option("-f, --force", "Overwrite existing files")
  .option("--dry-run", "Show what would be installed without installing")
  .option("--retry", "Enable retry logic for unreliable connections")
  .action(addCommand)

program
  .command("scan")
  .description("Scan utility directory and generate registry.json")
  .option("-o, --output <path>", "Output registry file", "./utility/registry.json")
  .option("-s, --source <path>", "Source directory to scan", "./utility")
  .option("-c, --cwd <cwd>", "Working directory", process.cwd())
  .action(scanCommand)

program
  .command("build")
  .description("Build utility components registry")
  .argument("[registry]", "Path to registry.json file", "./utility/registry.json")
  .option("-o, --output <path>", "Output directory", "./packages/registry/r/utility")
  .option("-c, --cwd <cwd>", "Working directory", process.cwd())
  .action(buildCommand)

program.on("command:*", () => {
  console.error(chalk.red(`Invalid command: ${program.args.join(" ")}`))
  console.log("See --help for a list of available commands.")
  process.exit(1)
})

program.parse() 