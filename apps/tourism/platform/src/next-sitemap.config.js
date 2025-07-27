// const {execSync} = require('child_process');

const fs = require('fs');

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const exclude = [
  '/404',
  '/support',
  '/review',
  '/travels',
  '/flights/*',
  '/bus/*',
  '/international/*',
  '/hotel/*',
  '/train/*',
  '/visa/*',
  '/profile',
  '/international-hotel',
  '/terms-and-conditions',
  '/connector',
  '/receipt*',
  '/profile/*',
  '/tour-sitemap.xml',
  '/flights-sitemap.xml',
  '/bus-sitemap.xml',
  '/hotel-sitemap.xml',
  '/international-sitemap.xml',
  '/train-sitemap.xml',
  '/visa-sitemap.xml',
];

const formatDate = (date) => date.slice(0, 19) + '+03:30';

const mapFileLocation = (loc) => {
  let adjustedLoc;
  const pagesIndex = loc.indexOf('pages');

  if (pagesIndex !== -1) {
    adjustedLoc = loc.substring(pagesIndex);
  } else {
    adjustedLoc = `pages${loc}`;
  }

  if (!adjustedLoc.endsWith('/index.tsx')) {
    adjustedLoc += '/index.tsx';
  }

  return adjustedLoc;
};

// const getLastModifiedDate = filePath => {
//   try {
//     const lastCommitDate = execSync(`git log -1 --format="%cI" -- ${filePath}`)
//       .toString()
//       .trim();
//     return new Date(lastCommitDate);
//   } catch (err) {
//     console.error(`Error reading file ${filePath}:`, err);
//     return new Date();
//   }
// };

const getLastModifiedDate = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime;
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    return new Date();
  }
};

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  transform: async (config, staticPath) => {
    const currentPath = mapFileLocation(staticPath);
    console.log(currentPath);
    const lastmod = getLastModifiedDate(currentPath).toISOString();

    return {
      loc: staticPath,
      lastmod: formatDate(lastmod),
    };
  },
  siteUrl: siteUrl,
  exclude,
  robotsTxtOptions: {
    additionalSitemaps: [
      `${siteUrl}/tour-sitemap.xml`,
      `${siteUrl}/flights-sitemap.xml`,
      `${siteUrl}/train-sitemap.xml`,
      `${siteUrl}/visa-sitemap.xml`,
      // `${siteUrl}/international-sitemap.xml`,
      // `${siteUrl}/hotel-sitemap.xml`,
      // `${siteUrl}/bus-sitemap.xml`,
    ],
  },
};
