const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // Project main settings
  projectId: 'opmaco',
  // E2E test settings
  e2e: {
    // Base URL for the application
    baseUrl: 'https://guest:welcome2qauto@qauto.forstudy.space',
    
    // Browser settings
    viewportWidth: 1280,
    viewportHeight: 720,

    // Video and screenshot settings
    video: true,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,

    // Timeout settings
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 30000,

    // Retry settings
    retries: {
      runMode: 2,
      openMode: 0
    },

    // Experimental features
    experimentalModifyObstructiveThirdPartyCode: true,

    // Security settings
    chromeWebSecurity: false, // Only for cross-origin testing

    // File path settings
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.{js,jsx,ts,tsx}",

    // Fixtures settings
    fixturesFolder: "cypress/fixtures",

    // Screenshots settings
    screenshotsFolder: "cypress/screenshots",

    // Video settings
    videosFolder: "cypress/videos",

    // Downloads settings
    downloadsFolder: "cypress/downloads",

    // Plugin settings
    setupNodeEvents(on, config) {
      // implement node event listeners here

      // File handling tasks
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        table(message) {
          console.table(message);
          return null;
        }
      });

      // Video handling
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          // Additional video processing if needed
          console.log(`Video saved: ${results.video}`);
        }
      });
    },
  },

  // Component Testing settings
  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
    specPattern: "cypress/component/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/component.{js,jsx,ts,tsx}",
  },

  // Parallel execution settings
  parallel: false,

  // CI/CD settings
  numTestsKeptInMemory: 0, // For CI environments

  // Debug settings
  watchForFileChanges: true,

  // Performance settings
  experimentalInteractiveRunEvents: true,
});
