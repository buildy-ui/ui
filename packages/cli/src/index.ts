#!/usr/bin/env node

import { Command } from "commander"
import chalk from "chalk"
import { addCommand } from "./commands/add.js"
import { initCommand } from "./commands/init.js"

const program = new Command()

program
  .name("buildy")
  .description("A CLI for adding UI components to your Vite React projects")
  .version("1.0.0")

program
  .command("init")
  .description("Initialize buildy in your project")
  .option("-y, --yes", "Skip prompts and use defaults")
  .action(initCommand)

program
  .command("add")
  .description("Add components to your project")
  .argument("[components...]", "Components to add")
  .option("-s, --semantic", "Use semantic components")
  .option("-f, --force", "Overwrite existing files")
  .option("--dry-run", "Show what would be installed without installing")
  .action(addCommand)

program.on("command:*", () => {
  console.error(chalk.red(`Invalid command: ${program.args.join(" ")}`))
  console.log("See --help for a list of available commands.")
  process.exit(1)
})

program.parse() 