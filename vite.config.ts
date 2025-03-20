
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Generate sitemap when building for production
  if (mode === 'production') {
    generateSitemap();
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    css: {
      // Ensure CSS is processed correctly
      devSourcemap: true,
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Make sure static assets in public folder are served
    publicDir: 'public',
    build: {
      // Improved browser compatibility
      target: 'es2015',
      outDir: 'dist',
      sourcemap: mode !== 'production',
      // Ensure proper chunks for better performance
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-toast',
              // Other UI libraries
            ],
          },
        },
      },
      // Ignore browserslist warnings during build
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    optimizeDeps: {
      // Ensure dependencies are properly optimized
      include: ['react-redux', 'redux-persist'],
      exclude: [],
    },
  };
});

// Function to generate the sitemap.xml file
function generateSitemap() {
  const domain = "https://platinumpath.net"; // Your website URL

  // Comprehensive list of all pages that should be indexed
  const pages = [
    // Main pages
    "",  // Home page
    "about",
    "original",
    "blog",
    "contact",
    "documentation",
    "friends",
    "guides",
    "leaderboard",
    "link-accounts",
    "pricing",
    "privacy",
    "profile",
    "settings",
    "support",
    "terms",
    "cookies",
    
    // Blog pages (examples)
    "blog/mastering-elden-ring-achievements",
    "blog/trophy-hunting-beginners",
    "blog/hidden-achievements",
    "blog/getting-started-with-achievement-hunting",
    "blog/top-10-easiest-platinum-trophies",
    "blog/psychology-of-achievement-hunting",
    
    // Auth and user pages
    "auth",
    "email-preferences",
  ];

  let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Add each page to the sitemap
  pages.forEach(page => {
    sitemapContent += `<url>
  <loc>${domain}/${page}</loc>
  <changefreq>weekly</changefreq>
  <priority>${page === "" ? "1.0" : "0.8"}</priority>
  <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
</url>
`;
  });

  sitemapContent += `</urlset>`;

  // Ensure directory exists
  if (!fs.existsSync('./public')) {
    fs.mkdirSync('./public');
  }

  // Write sitemap file
  fs.writeFileSync("./public/sitemap.xml", sitemapContent);
  console.log("✅ Sitemap generated successfully!");
}
