#!/usr/bin/env

import { Command } from "commander"
import chalk from "chalk"
import { addCommand } from "./commands/add.js"
import { initCommand } from "./commands/init.js"
import { buildCommand } from "./commands/build.js"
import { scanCommand } from "./commands/scan.js"

const program = new Command()

program
  .name("buildy")
  .description("A CLI for adding UI components to your Vite React projects (UI8Kit core/form registries)")
  .version("1.0.0")

program
  .command("init")
  .description("Initialize UI8Kit structure in your project")
  .option("-y, --yes", "Skip prompts and use defaults")
  .option("-r, --registry <type>", "Registry type: core, form", "core")
  .action(initCommand)

program
  .command("add")
  .description("Add components to your project from different registries")
  .argument("[components...]", "Components to add")
  .option("-a, --all", "Install all available components")
  .option("-f, --force", "Overwrite existing files")
  .option("-r, --registry <type>", "Registry type: core, form", "core")
  .option("--dry-run", "Show what would be installed without installing")
  .option("--retry", "Enable retry logic for unreliable connections")
  .action(addCommand)

program
  .command("scan")
  .description("Scan and generate registry from existing components")
  .option("-r, --registry <type|path>", "Registry type (core|form) or custom path", "core")
  .option("-o, --output <file>", "Output registry file")
  .option("-s, --source <dir>", "Source directory to scan")
  .option("--cwd <dir>", "Working directory")
  .action(async (options) => {
    await scanCommand(options)
  })

program
  .command("build")
  .description("Build components registry")
  .argument("[registry]", "Path to registry.json file", "./src/registry.json")
  .option("-o, --output <path>", "Output directory", "./packages/registry/r/core")
  .option("-c, --cwd <cwd>", "Working directory", process.cwd())
  .action(buildCommand)

program.on("command:*", () => {
  console.error(chalk.red(`Invalid command: ${program.args.join(" ")}`))
  console.log("See --help for a list of available commands.")
  process.exit(1)
})

program.parse() 