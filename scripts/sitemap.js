
const fs = require("fs");

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

// Uncomment to write to file when running this script directly
// fs.writeFileSync("public/sitemap.xml", sitemapContent);
console.log(sitemapContent);
console.log("✅ Sitemap generated successfully!");
