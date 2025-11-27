// Centralized CLI messages and user-facing strings
export const CLI_MESSAGES = {
  // Error messages
  errors: {
    noComponentsSpecified: "Please specify at least one component to add.",
    notInitialized: "buildy is not initialized in this project.",
    notViteProject: "This doesn't appear to be a Vite project.",
    reactNotInstalled: "React is not installed in this project.",
    buildFailed: "Build failed:",
    scanFailed: "Scan failed:",
    registryTempUnavailable: "registry temporarily unavailable",
    noCDNFound: (registryType: string) => `No working ${registryType} CDN found`,
    componentNotFound: (name: string, registryType: string) => `Component "${name}" not found in ${registryType} registry`,
    unknownComponentType: (type: string) => `Unknown component type: ${type}`,
    fileNotFound: (path: string) => `File not found: ${path}`,
    invalidConfig: "Invalid buildy.config.json:",
    failedToInstall: (name: string, registryType: string) => `Failed to install ${name} from ${registryType}`,
    failedToFetch: (registryType: string) => `Failed to fetch components from ${registryType}`,
    failedToFetchComponent: (name: string, registryType: string) => `Failed to fetch ${name} from ${registryType}:`,
    failedToAnalyzeDeps: (path: string) => `Warning: Could not analyze dependencies for ${path}:`,
    dependenciesFailed: "Failed to install dependencies",
    couldNotInstallDeps: (name: string) => `Warning: Could not install some dependencies for ${name}`,
  },

  // Success messages
  success: {
    initialized: (registryName: string) => `UI8Kit ${registryName} structure initialized successfully!`,
    setupComplete: (registryName: string) => `UI8Kit ${registryName} Setup complete!`,
    installed: (name: string, registryType: string) => `Installed ${name} from ${registryType}`,
    allInstalled: (registryType: string) => `All ${registryType} components installed successfully!`,
    componentsInstalled: "Components installed successfully!",
    depsInstalled: "Dependencies installed",
    registryBuilt: "Registry built successfully!",
    schemasGenerated: "Schema files generated successfully!",
    registryGenerated: (registryName: string) => `${registryName} registry generated successfully!`,
    depsAvailable: "All dependencies already available",
  },

  // Info messages
  info: {
    initializing: (registryName: string) => `Initializing UI8Kit buildy in your project (${registryName} registry)...`,
    installing: (registryName: string) => `Installing from ${registryName} registry...`,
    installingAll: (registryName: string) => `Installing all available components from ${registryName} registry...`,
    retryEnabled: "Retry mode enabled - using enhanced connection logic",
    fetchingComponentList: (registryType: string) => `Fetching component list from ${registryType}...`,
    fetchingRegistry: (registryType: string) => `Fetching ${registryType} registry index`,
    scanningComponents: (registryName: string) => `Scanning ${registryName} components...`,
    building: "Building registry...",
    processingComponents: "Processing components...",
    scanningDirectories: "Scanning directories...",
    analyzingDeps: "Found {count} components, analyzing dependencies...",
    installationCancelled: "Initialization cancelled.",
    workspaceDepsDetected: "Workspace dependency detected. Installing individually...",
    checkingConnection: "Checking internet connection...",
    testing: (registryType: string, baseUrl: string) => `Testing ${registryType} CDN: ${baseUrl}`,
    using: (registryType: string, baseUrl: string) => `Using ${registryType} CDN: ${baseUrl}`,
    loading: (name: string, registryType: string, folder: string, type: string) => 
      `Loading ${name} from /${registryType}/${folder}/ (type: ${type})`,
    fetching: (registryType: string, url: string) => `Fetching from ${registryType}: ${url}`,
    fetchingUrl: "Fetching component from:",
    fetchingUrlWithRetry: "Fetching component from URL with retry:",
  },

  // Prompts
  prompts: {
    typescript: "Are you using TypeScript?",
    overwrite: (registryName: string) => 
      `UI8Kit buildy is already initialized for ${registryName} registry. Overwrite configuration?`,
  },

  // Examples and help text
  examples: {
    add: [
      "Example: npx buildy-ui@latest add button card",
      "Example: npx buildy-ui@latest add button --registry ui",
      "Example: npx buildy-ui@latest add all  # Install all components",
      'Example: npx buildy-ui@latest add --all --registry ui  # Install all ui components',
      "Example: npx buildy-ui@latest add --retry  # Enable retry for unreliable connections",
      'Example: npx buildy-ui@latest add "https://example.com/component.json"'
    ],
    init: [
      `npx buildy-ui@latest add button --registry ui - Add a button component`,
      `npx buildy-ui@latest add card input --registry ui - Add multiple components`,
      `npx buildy-ui@latest add --all --registry ui - Add all components`,
      `npx buildy-ui@latest add "https://example.com/component.json" - Add from external URL`
    ],
    troubleshooting: [
      "Check your internet connection",
      "Use --retry flag: npx buildy-ui@latest add --all --retry",
      "Use VPN if available",
      "Install from URL: npx buildy-ui@latest add 'https://...'",
      "Check https://buildy.tw for manual download"
    ]
  },

  // Directory descriptions
  directories: {
    lib: "Utils, helpers, functions",
    ui: "UI components",
    components: "Complex components",
    layouts: "Page layouts and structures",
    blocks: "Component blocks",
    variants: "CVA variant configurations",
  },

  // Spinners and status
  status: {
    installing: (name: string, registryType: string) => `Installing ${name} from ${registryType}...`,
    wouldInstall: (name: string, registryType: string) => `Would install: ${name} from ${registryType}`,
    foundComponents: (count: number, registryType: string) => `Found ${count} components in ${registryType}`,
    wouldInstallFrom: (registryType: string) => `Would install from ${registryType}:`,
    builtComponents: (count: number) => `Built ${count} components`,
    scannedComponents: (count: number) => `Scanned ${count} components`,
    skipped: (fileName: string) => `Skipped ${fileName} (already exists, use --force to overwrite)`,
  }
}

// Formatted output helpers
export function formatInstallationSummary(registryType: string, successful: number, failed: number): string {
  return `Installation Summary:
   Registry: ${registryType}
   ✅ Successful: ${successful}
   ❌ Failed: ${failed}`
}

export function formatComponentSummary(items: Array<{type: string}>): string {
  const summary: Record<string, number> = {}
  items.forEach(item => {
    summary[item.type] = (summary[item.type] || 0) + 1
  })
  return Object.entries(summary).map(([type, count]) => `   ${type}: ${count}`).join("\n")
}
