
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
      destination: 'dist'
    };

    await run(reactSnapConfig);
    console.log('✅ Pre-rendering completed successfully!');
  } catch (error) {
    console.error('❌ Pre-rendering failed:', error);
    process.exit(1);
  }
}

postBuild();
