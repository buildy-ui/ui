import fs from "fs-extra"
import path from "path"
import chalk from "chalk"

export interface DependencyStatus {
  installed: string[]
  missing: string[]
  workspace: string[]
}

export async function checkProjectDependencies(requiredDeps: string[]): Promise<DependencyStatus> {
  const packageJsonPath = path.join(process.cwd(), "package.json")
  
  if (!(await fs.pathExists(packageJsonPath))) {
    return {
      installed: [],
      missing: requiredDeps,
      workspace: []
    }
  }
  
  try {
    const packageJson = await fs.readJson(packageJsonPath)
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    }
    
    const installed: string[] = []
    const missing: string[] = []
    const workspace: string[] = []
    
    for (const dep of requiredDeps) {
      const version = allDeps[dep]
      
      if (!version) {
        missing.push(dep)
      } else if (version.startsWith("workspace:")) {
        workspace.push(dep)
      } else {
        installed.push(dep)
      }
    }
    
    return { installed, missing, workspace }
  } catch (error) {
    return {
      installed: [],
      missing: requiredDeps,
      workspace: []
    }
  }
}

export function showDependencyStatus(deps: DependencyStatus) {
  if (deps.installed.length > 0) {
    console.log(chalk.green(`   ✅ Already installed: ${deps.installed.join(", ")}`))
  }
  
  if (deps.workspace.length > 0) {
    console.log(chalk.blue(`   🔗 Workspace dependencies: ${deps.workspace.join(", ")}`))
  }
  
  if (deps.missing.length > 0) {
    console.log(chalk.yellow(`   📦 Will install: ${deps.missing.join(", ")}`))
  }
}

export async function filterMissingDependencies(dependencies: string[]): Promise<string[]> {
  const status = await checkProjectDependencies(dependencies)
  
  // Return only missing dependencies (not workspace ones)
  return status.missing
}

export function isWorkspaceError(errorMessage: string): boolean {
  return errorMessage.includes("EUNSUPPORTEDPROTOCOL") || 
         errorMessage.includes("workspace:") ||
         errorMessage.includes("Unsupported URL Type \"workspace:\"")
} 