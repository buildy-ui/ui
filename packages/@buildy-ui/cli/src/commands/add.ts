import chalk from "chalk"
import ora from "ora"
import path from "path"
import fs from "fs-extra"
import { execa } from "execa"
import { getComponent, getAllComponents } from "../registry/api.js"
import { getComponentWithRetry, getAllComponentsWithRetry } from "../registry/retry-api.js"
import { findConfig } from "../utils/project.js"
import { Component, type Config } from "../registry/schema.js"
import { SCHEMA_CONFIG, type RegistryType } from "../utils/schema-config.js"
import { validateComponentInstallation, handleValidationError } from "../utils/registry-validator.js"
import { checkProjectDependencies, showDependencyStatus, filterMissingDependencies, isWorkspaceError } from "../utils/dependency-checker.js"
import { CLI_MESSAGES } from "../utils/cli-messages.js"

interface AddOptions {
  force?: boolean
  dryRun?: boolean
  all?: boolean
  retry?: boolean
  registry?: string
}

export async function addCommand(components: string[], options: AddOptions) {
  const registryType = resolveRegistryType(options.registry)
  
  if (options.all || components.includes("all")) {
    return await addAllComponents(options, registryType)
  }
  
  if (components.length === 0) {
    console.error(chalk.red(`❌ ${CLI_MESSAGES.errors.noComponentsSpecified}`))
    CLI_MESSAGES.examples.add.forEach(example => console.log(example))
    process.exit(1)
  }
  
  const validation = await validateComponentInstallation(components, registryType)
  if (!validation.isValid) {
    handleValidationError(validation)
  }
  
  const config = await findConfig(registryType)
  if (!config) {
    console.error(chalk.red(`❌ ${CLI_MESSAGES.errors.notInitialized}`))
    console.log(`Run 'npx buildy-ui@latest init' first.`)
    console.log(`For ${registryType} registry, run: npx buildy-ui@latest init --registry ${registryType}`)
    process.exit(1)
  }
  
  const getComponentFn = options.retry ? getComponentWithRetry : getComponent
  
  if (options.retry) {
    console.log(chalk.blue(`🔄 ${CLI_MESSAGES.info.retryEnabled}`))
  }
  
  console.log(chalk.blue(`📦 ${CLI_MESSAGES.info.installing(registryType)}`))
  
  const results = await processComponents(components, registryType, config, getComponentFn, options)
  
  displayInstallationSummary(registryType, results)
}

async function addAllComponents(options: AddOptions, registryType: RegistryType) {
  console.log(chalk.blue(`🚀 ${CLI_MESSAGES.info.installingAll(registryType)}`))

  const config = await findConfig(registryType)
  if (!config) {
    console.error(chalk.red(`❌ ${CLI_MESSAGES.errors.notInitialized}`))
    console.log(`Run 'npx buildy-ui@latest init' first.`)
    console.log(`For ${registryType} registry, run: npx buildy-ui@latest init --registry ${registryType}`)
    process.exit(1)
  }
  
  const getAllComponentsFn = options.retry ? getAllComponentsWithRetry : getAllComponents
  
  if (options.retry) {
    console.log(chalk.blue(`🔄 ${CLI_MESSAGES.info.retryEnabled}`))
  }
  
  const spinner = ora(CLI_MESSAGES.info.fetchingComponentList(registryType)).start()
  
  try {
    const allComponents = await getAllComponentsFn(registryType)
    
    if (allComponents.length === 0) {
      spinner.fail(`No components found in ${registryType} registry`)
      console.log(chalk.yellow(`\n⚠️  ${registryType} ${CLI_MESSAGES.errors.registryTempUnavailable}`))
      console.log("Try these alternatives:")
      CLI_MESSAGES.examples.troubleshooting.forEach(alt => console.log(`  • ${alt}`))
      return
    }
    
    spinner.succeed(CLI_MESSAGES.status.foundComponents(allComponents.length, registryType))
    
    if (options.dryRun) {
      console.log(chalk.blue(`\n📋 ${CLI_MESSAGES.status.wouldInstallFrom(registryType)}`))
      allComponents.forEach(comp => {
        console.log(`   - ${comp.name} (${comp.type})`)
      })
      return
    }
    
    const results = await processComponents(
      allComponents.map(c => c.name),
      registryType,
      config,
      options.retry ? getComponentWithRetry : getComponent,
      options,
      allComponents
    )
    
    displayInstallationSummary(registryType, results)
    
  } catch (error) {
    spinner.fail(CLI_MESSAGES.errors.failedToFetch(registryType))
    console.error(chalk.red("❌ Error:"), (error as Error).message)
    console.log(chalk.yellow(`\n⚠️  ${registryType} ${CLI_MESSAGES.errors.registryTempUnavailable}`))
    console.log("Try these alternatives:")
    CLI_MESSAGES.examples.troubleshooting.forEach(alt => console.log(`  • ${alt}`))
    process.exit(1)
  }
}

async function processComponents(
  componentNames: string[],
  registryType: RegistryType,
  config: Config,
  getComponentFn: (name: string, type: RegistryType) => Promise<Component | null>,
  options: AddOptions,
  preloadedComponents?: Component[]
): Promise<Array<{ name: string; status: "success" | "error"; error?: string }>> {
  const results: Array<{ name: string; status: "success" | "error"; error?: string }> = []
  const componentMap = new Map(preloadedComponents?.map(c => [c.name, c]))
  
  for (const componentName of componentNames) {
    const spinner = ora(CLI_MESSAGES.status.installing(componentName, registryType)).start()
    
    try {
      let component = componentMap?.get(componentName)
      
      if (!component) {
        component = await getComponentFn(componentName, registryType)
      }
      
      if (!component) {
        throw new Error(CLI_MESSAGES.errors.componentNotFound(componentName, registryType))
      }
      
      if (options.dryRun) {
        spinner.succeed(CLI_MESSAGES.status.wouldInstall(component.name, registryType))
        console.log(`   Type: ${component.type}`)
        console.log(`   Files: ${component.files.length}`)
        console.log(`   Dependencies: ${component.dependencies.join(", ") || "none"}`)
        
        if (component.dependencies.length > 0) {
          const depStatus = await checkProjectDependencies(component.dependencies)
          showDependencyStatus(depStatus)
        }
        continue
      }
      
      await installComponentFiles(component, config, options.force)
      
      if (component.dependencies.length > 0) {
        try {
          await installDependencies(component.dependencies)
        } catch (error) {
          console.log(chalk.yellow(`   ⚠️  ${CLI_MESSAGES.errors.couldNotInstallDeps(component.name)}`))
          console.log(chalk.yellow(`   Dependencies: ${component.dependencies.join(", ")}`))
          console.log(chalk.yellow(`   Please install them manually if needed`))
        }
      }
      
      spinner.succeed(CLI_MESSAGES.status.installing(component.name, registryType))
      results.push({ name: component.name, status: "success" })
      
    } catch (error) {
      spinner.fail(CLI_MESSAGES.errors.failedToInstall(componentName, registryType))
      console.error(chalk.red(`   Error: ${(error as Error).message}`))
      results.push({ 
        name: componentName, 
        status: "error", 
        error: (error as Error).message 
      })
    }
  }
  
  return results
}

function displayInstallationSummary(
  registryType: RegistryType,
  results: Array<{ name: string; status: "success" | "error" }>
) {
  const successful = results.filter(r => r.status === "success")
  const failed = results.filter(r => r.status === "error")
  
  console.log(chalk.blue("\n📊 Installation Summary:"))
  console.log(`   Registry: ${registryType}`)
  console.log(`   ✅ Successful: ${successful.length}`)
  console.log(`   ❌ Failed: ${failed.length}`)
  
  if (successful.length > 0) {
    console.log(chalk.green(`\n🎉 ${CLI_MESSAGES.success.componentsInstalled}`))
    console.log("You can now import and use them in your project.")
  }
  
  if (failed.length > 0) {
    process.exit(1)
  }
}

async function installComponentFiles(
  component: Component,
  config: Config,
  force = false
): Promise<void> {
  for (const file of component.files) {
    const fileName = path.basename(file.path)

    const target = file.target || inferTargetFromType(component.type)
    const installDir = resolveInstallDir(target, config)
    const targetPath = path.join(process.cwd(), installDir, fileName)

    if (!force && await fs.pathExists(targetPath)) {
      console.log(`   ⚠️  ${CLI_MESSAGES.status.skipped(fileName)}`) 
      continue
    }

    await fs.ensureDir(path.dirname(targetPath))
    await fs.writeFile(targetPath, file.content, "utf-8")
  }
}

function inferTargetFromType(componentType: string): string {
  switch (componentType) {
    case "registry:ui":
      return "ui"
    case "registry:block":
      return "blocks"
    case "registry:component":
      return "components"
    case "registry:layout":
      return "layouts"
    case "registry:lib":
      return "lib"
    default:
      return "components"
  }
}

function resolveInstallDir(target: string, config: Config): string {
  if (target === "lib") {
    return normalizeDir(config.libDir || SCHEMA_CONFIG.defaultDirectories.lib)
  }

  // Base components directory
  const baseComponentsDir = normalizeDir(config.componentsDir || SCHEMA_CONFIG.defaultDirectories.components)
  if (target === "ui") return path.join(baseComponentsDir, "ui").replace(/\\/g, "/")
  if (target === "components") return baseComponentsDir

  switch (target) {
    case "blocks":
      return normalizeDir(SCHEMA_CONFIG.defaultDirectories.blocks)
    case "layouts":
      return normalizeDir(SCHEMA_CONFIG.defaultDirectories.layouts)
    default:
      return baseComponentsDir
  }
}

function normalizeDir(dir: string): string {
  return dir.replace(/^\.\//, "").replace(/\\/g, "/")
}

function resolveRegistryType(registryInput?: string): RegistryType {
  if (!registryInput) {
    return SCHEMA_CONFIG.defaultRegistryType
  }
  
  if (SCHEMA_CONFIG.registryTypes.includes(registryInput as any)) {
    return registryInput as RegistryType
  }
  
  console.warn(chalk.yellow(`⚠️  Unknown registry type: ${registryInput}`))
  console.log(`Available registries: ${SCHEMA_CONFIG.registryTypes.join(", ")}`)
  console.log(`Using default: ${SCHEMA_CONFIG.defaultRegistryType}`)
  
  return SCHEMA_CONFIG.defaultRegistryType
}

async function installDependencies(dependencies: string[]): Promise<void> {
  const spinner = ora(CLI_MESSAGES.status.installing("dependencies", "")).start()
  
  try {
    const depStatus = await checkProjectDependencies(dependencies)
    const missingDependencies = await filterMissingDependencies(dependencies)
    
    if (missingDependencies.length === 0) {
      spinner.succeed(CLI_MESSAGES.success.depsAvailable)
      if (depStatus.workspace.length > 0) {
        console.log(chalk.blue(`   🔗 Using workspace dependencies: ${depStatus.workspace.join(", ")}`))
      }
      return
    }
    
    showDependencyStatus(depStatus)
    
    const packageManager = await detectPackageManager()
    
    const installCommand = packageManager === "npm" 
      ? ["install", ...missingDependencies]
      : ["add", ...missingDependencies]
    
    await execa(packageManager, installCommand, {
      cwd: process.cwd(),
      stdio: "pipe"
    })
    
    spinner.succeed(CLI_MESSAGES.success.depsInstalled)
  } catch (error) {
    spinner.fail(CLI_MESSAGES.errors.dependenciesFailed)
    
    const errorMessage = (error as any).stderr || (error as Error).message
    
    if (isWorkspaceError(errorMessage)) {
      console.log(chalk.yellow(`\n💡 ${CLI_MESSAGES.info.workspaceDepsDetected}`))
      
      const results = await installDependenciesIndividually(dependencies)
      
      if (results.some(r => r.success)) {
        console.log(chalk.green("✅ Some dependencies installed successfully"))
        return
      }
    }
    
    throw new Error(`${CLI_MESSAGES.errors.dependenciesFailed}: ${errorMessage}`)
  }
}

async function installDependenciesIndividually(dependencies: string[]): Promise<Array<{dep: string, success: boolean}>> {
  const packageManager = await detectPackageManager()
  const results: Array<{dep: string, success: boolean}> = []
  
  const missingDeps = await filterMissingDependencies(dependencies)
  
  for (const dep of missingDeps) {
    try {
      const installCommand = packageManager === "npm" 
        ? ["install", dep]
        : ["add", dep]
      
      await execa(packageManager, installCommand, {
        cwd: process.cwd(),
        stdio: "pipe"
      })
      
      console.log(chalk.green(`   ✅ Installed ${dep}`))
      results.push({dep, success: true})
    } catch (error) {
      console.log(chalk.yellow(`   ⚠️  Skipped ${dep} (may already be available)`))
      results.push({dep, success: false})
    }
  }
  
  return results
}

async function detectPackageManager(): Promise<string> {
  if (await fs.pathExists("bun.lock")) return "bun"
  if (await fs.pathExists("pnpm-lock.yaml")) return "pnpm"
  if (await fs.pathExists("yarn.lock")) return "yarn"
  return "npm"
} 