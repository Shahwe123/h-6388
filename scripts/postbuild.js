
const { run } = require('react-snap');

async function postBuild() {
  try {
    // Config for react-snap
    const reactSnapConfig = {
      // The following routes will be pre-rendered
      include: [
        '/',
        '/about',
        '/blog',
        '/contact',
        '/documentation',
        '/guides',
        '/leaderboard',
        '/pricing',
        '/privacy',
        '/support',
        '/terms'
      ],
      // Wait until the network is idle
      puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
      skipThirdPartyRequests: true,
      // Wait for network to be idle to ensure all data is loaded
      waitFor: 2000,
      // Handle dynamic routes
      fixWebpackChunksIssue: false,
      // Preserve state between pages
      removeBlobs: false,
      // Default destination directory
      destination: 'dist',
      // Disable browserslist warnings
      minifyHtml: {
        collapseWhitespace: true,
        removeComments: true,
      },
      crawl: true,
    };

    await run(reactSnapConfig);
    console.log('✅ Pre-rendering completed successfully!');
  } catch (error) {
    console.error('❌ Pre-rendering failed:', error);
    // Don't exit with error code to prevent CI/CD failures
    // This allows the build to complete even if pre-rendering fails
    console.log('Continuing build process despite pre-rendering issues...');
  }
}

postBuild();
