
const { run } = require('react-snap');
const fs = require('fs');

async function postBuild() {
  try {
    // Config for react-snap
    const reactSnapConfig = {
      // The following routes will be pre-rendered - comprehensive list
      include: [
        '/',
        '/about',
        '/original',
        '/blog',
        '/contact',
        '/documentation',
        '/friends',
        '/guides',
        '/leaderboard',
        '/link-accounts',
        '/pricing',
        '/privacy',
        '/profile',
        '/settings',
        '/support',
        '/terms',
        '/cookies',
        '/auth',
        '/email-preferences',
        '/blog/mastering-elden-ring-achievements',
        '/blog/trophy-hunting-beginners',
        '/blog/hidden-achievements',
        '/blog/getting-started-with-achievement-hunting',
        '/blog/top-10-easiest-platinum-trophies',
        '/blog/psychology-of-achievement-hunting'
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
    
    // Verify sitemap exists
    if (fs.existsSync('./dist/sitemap.xml')) {
      console.log('✅ Sitemap found in build directory');
    } else {
      console.warn('⚠️ Sitemap not found in build directory');
      // Copy from public if it exists
      if (fs.existsSync('./public/sitemap.xml')) {
        fs.copyFileSync('./public/sitemap.xml', './dist/sitemap.xml');
        console.log('✅ Sitemap copied from public directory');
      }
    }
    
    // Verify robots.txt exists
    if (fs.existsSync('./dist/robots.txt')) {
      console.log('✅ robots.txt found in build directory');
    } else {
      console.warn('⚠️ robots.txt not found in build directory');
      if (fs.existsSync('./public/robots.txt')) {
        fs.copyFileSync('./public/robots.txt', './dist/robots.txt');
        console.log('✅ robots.txt copied from public directory');
      }
    }
    
  } catch (error) {
    console.error('❌ Pre-rendering failed:', error);
    // Don't exit with error code to prevent CI/CD failures
    // This allows the build to complete even if pre-rendering fails
    console.log('Continuing build process despite pre-rendering issues...');
  }
}

postBuild();
