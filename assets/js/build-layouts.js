const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = path.resolve(__dirname, '../../');
const PAGES_DIR = path.resolve(WORKSPACE_DIR, 'pages');

const HEADER_TEMPLATE = `
<header class="sticky top-0 z-50 w-full transition-all duration-300 backdrop-blur-md bg-[var(--color-bg-canvas)]/80 border-b border-[var(--color-border)] shadow-sm">
  <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
    <!-- Brand Logo -->
    <a href="ROOT_PATHindex.html" class="hover:opacity-85 transition-opacity focus:outline-none focus:ring-2 focus:ring-amber-500 rounded px-1 flex items-center gap-3">
      <img src="ROOT_PATHassets/images/brand-logo.png" alt="VINTCAM" class="h-10 w-auto object-contain dark:invert transition-all duration-300" />
      <span class="font-display text-2xl tracking-widest text-[var(--color-text-dark)] uppercase">VINTCAM</span>
    </a>
    
    <!-- Desktop Navigation Links -->
    <nav class="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide" id="desktop-nav">
      <a href="ROOT_PATHindex.html" class="nav-link relative py-1">Home</a>
      <a href="PAGES_PATHhome2.html" class="nav-link relative py-1">Home 2</a>
      <a href="PAGES_PATHabout.html" class="nav-link relative py-1">About</a>
      <a href="PAGES_PATHblog.html" class="nav-link relative py-1">Blog</a>
      <a href="PAGES_PATHservices-products.html" class="nav-link relative py-1">Service</a>
      <a href="PAGES_PATHcontact.html" class="nav-link relative py-1">Contact</a>
    </nav>

    <!-- Right-side Actions -->
    <div class="flex items-center gap-6">
      <!-- Theme Switcher Button -->
      <button onclick="toggleTheme()" class="theme-btn p-2 rounded-full hover:bg-[var(--color-bg-card)] border border-transparent hover:border-[var(--color-border)] transition-all relative group flex items-center justify-center" aria-label="Toggle dark/light mode">
        <svg xmlns="http://www.w3.org/2000/svg" id="theme-sun-path" class="h-5 w-5 theme-toggle-icon hidden text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" id="theme-moon-path" class="h-5 w-5 theme-toggle-icon text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>

      <!-- Hamburger Menu Button (Mobile) -->
      <button onclick="toggleMobileMenu()" class="md:hidden p-2 rounded-full hover:bg-[var(--color-bg-card)] transition-colors flex items-center justify-center" aria-label="Open navigation menu">
        <svg id="hamburger-icon" class="h-6 w-6 text-[var(--color-text-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </div>

  <!-- Mobile Drawer Overlay and Container -->
  <div id="mobile-menu-drawer" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300">
    <div class="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-[var(--color-bg-canvas)] shadow-2xl p-8 flex flex-col justify-between transform translate-x-full transition-transform duration-300 ease-out" id="mobile-menu-content">
      <div>
        <div class="flex items-center justify-between mb-8 pb-4 border-b border-[var(--color-border)]">
          <a href="ROOT_PATHindex.html" class="flex items-center hover:opacity-85 transition-opacity focus:outline-none rounded px-1 gap-2.5">
            <img src="ROOT_PATHassets/images/brand-logo.png" alt="VINTCAM" class="h-8 w-auto object-contain dark:invert transition-all duration-300" />
            <span class="font-display text-xl tracking-widest text-[var(--color-text-dark)] uppercase">VINTCAM</span>
          </a>
          <button onclick="toggleMobileMenu()" class="p-2 rounded-full hover:bg-[var(--color-bg-card)] transition-colors flex items-center justify-center" aria-label="Close menu">
            <svg class="h-6 w-6 text-[var(--color-text-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav class="flex flex-col gap-5 text-base font-bold tracking-wide">
          <a href="ROOT_PATHindex.html" class="mobile-nav-link hover:text-amber-600 transition-colors py-1">Home</a>
          <a href="PAGES_PATHhome2.html" class="mobile-nav-link hover:text-amber-600 transition-colors py-1">Home 2</a>
          <a href="PAGES_PATHabout.html" class="mobile-nav-link hover:text-amber-600 transition-colors py-1">About</a>
          <a href="PAGES_PATHblog.html" class="mobile-nav-link hover:text-amber-600 transition-colors py-1">Blog</a>
          <a href="PAGES_PATHservices-products.html" class="mobile-nav-link hover:text-amber-600 transition-colors py-1">Service</a>
          <a href="PAGES_PATHcontact.html" class="mobile-nav-link hover:text-amber-600 transition-colors py-1">Contact</a>
        </nav>
      </div>
      <div class="border-t border-[var(--color-border)] pt-6 flex flex-col gap-4">
        <div class="flex items-center justify-between px-2 mb-2">
          <div>
            <p class="text-[10px] uppercase font-bold tracking-wider text-amber-600">Guest User</p>
            <p class="text-xs text-[var(--color-text-muted)]">guest@vintcam.com</p>
          </div>
        </div>
        <a href="PAGES_PATHhome2.html" class="w-full text-center py-2.5 border border-[var(--color-border)] text-[var(--color-text-dark)] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[var(--color-bg-card)] transition-colors">Admin Dashboard</a>
        <a href="#" class="w-full text-center py-2.5 bg-[var(--color-text-dark)] text-[var(--color-bg-canvas)] text-xs font-bold uppercase tracking-wider rounded-xl hover:opacity-90 transition-opacity">Signup / Login</a>
      </div>
    </div>
  </div>
</header>
`;

const FOOTER_TEMPLATE = `
<footer class="bg-[var(--color-bg-card)] border-t border-[var(--color-border)] mt-auto transition-colors duration-300">
  <div class="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12">
    <!-- Brand Info Section -->
    <div class="lg:col-span-4 flex flex-col justify-between gap-6">
      <div>
        <a href="ROOT_PATHindex.html" class="inline-block mb-4 hover:opacity-85 transition-opacity focus:outline-none rounded px-1">
          <img src="ROOT_PATHassets/images/brand-logo.png" alt="VINTCAM" class="h-10 w-auto object-contain dark:invert transition-all duration-300" /><span class="font-display text-2xl tracking-widest text-[var(--color-text-dark)] uppercase">VINTCAM</span>
        </a>
        <p class="text-xs leading-relaxed max-w-sm text-[var(--color-text-muted)]">
          Preserving design history and optomechanical excellence. We source, meticulously calibrate, and fully warrant master analog gear and cold-stored format emulsions for contemporary artists.
        </p>
      </div>
      <!-- Social Media Icons -->
      <div class="flex items-center gap-3">
        <a href="#" class="social-icon-btn w-9 h-9 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)]" aria-label="Instagram">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9a3 3 0 100 6 3 3 0 000-6z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 16.5A3 3 0 0019.5 7.5a3 3 0 000 9z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" />
          </svg>
        </a>
        <a href="#" class="social-icon-btn w-9 h-9 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)]" aria-label="Twitter">
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a href="#" class="social-icon-btn w-9 h-9 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)]" aria-label="YouTube">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.75 9l-3.5 2.25V9l3.5 2.25z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </a>
        <a href="#" class="social-icon-btn w-9 h-9 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)]" aria-label="Pinterest">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1.2 13.6c-.6.6-1.5.9-2.4.9s-1.8-.3-2.4-.9c-.6-.6-.9-1.5-.9-2.4h1.5c0 .6.2 1 .5 1.3.3.3.7.5 1.3.5s1-.2 1.3-.5c.3-.3.5-.7.5-1.3v-3.5h1.5v3.5c0 1-.3 1.8-.9 2.4z" />
          </svg>
        </a>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="lg:col-span-2">
      <h4 class="font-display uppercase text-sm tracking-wider mb-6 text-amber-600 dark:text-amber-500">Quick Links</h4>
      <ul class="flex flex-col gap-4 text-xs font-semibold">
        <li><a href="ROOT_PATHindex.html" class="hover:text-amber-600 hover:pl-1 transition-all duration-300 text-[var(--color-text-muted)] hover:text-amber-600">Home</a></li>
        <li><a href="PAGES_PATHhome2.html" class="hover:text-amber-600 hover:pl-1 transition-all duration-300 text-[var(--color-text-muted)] hover:text-amber-600">Home 2</a></li>
        <li><a href="PAGES_PATHabout.html" class="hover:text-amber-600 hover:pl-1 transition-all duration-300 text-[var(--color-text-muted)] hover:text-amber-600">About Our Guild</a></li>
        <li><a href="PAGES_PATHblog.html" class="hover:text-amber-600 hover:pl-1 transition-all duration-300 text-[var(--color-text-muted)] hover:text-amber-600">The Silver Journal</a></li>
        <li><a href="PAGES_PATHservices-products.html" class="hover:text-amber-600 hover:pl-1 transition-all duration-300 text-[var(--color-text-muted)] hover:text-amber-600">Our Services</a></li>
        <li><a href="PAGES_PATHcontact.html" class="hover:text-amber-600 hover:pl-1 transition-all duration-300 text-[var(--color-text-muted)] hover:text-amber-600">Contact Desk</a></li>
      </ul>
    </div>

    <!-- Legal -->
    <div class="lg:col-span-2">
      <h4 class="font-display uppercase text-sm tracking-wider mb-6 text-amber-600 dark:text-amber-500">Legal</h4>
      <ul class="flex flex-col gap-4 text-xs font-semibold text-[var(--color-text-muted)]">
        <li><a href="PAGES_PATHterms.html" class="hover:text-amber-600 transition-all duration-300">Terms</a></li>
        <li><a href="PAGES_PATHprivacy.html" class="hover:text-amber-600 transition-all duration-300">Privacy</a></li>
        <li><a href="PAGES_PATHfaq.html" class="hover:text-amber-600 transition-all duration-300">FAQ</a></li>
      </ul>
    </div>

    <!-- Newsletter Subscription Column -->
    <div class="lg:col-span-4">
      <h4 class="font-display uppercase text-sm tracking-wider mb-6 text-amber-600 dark:text-amber-500">The dispatch</h4>
      <p class="text-xs leading-relaxed mb-6 text-[var(--color-text-muted)]">
        Get instant notifications directly to your workbench when cold-stored format stock drops or rare master cameras enter our NYC vault.
      </p>
      <form class="flex gap-2" onsubmit="event.preventDefault(); alert('Subscribed to the inner circle dispatch successfully!');">
        <input type="email" placeholder="Your operating email" required class="flex-1 px-4 py-3 bg-[var(--color-bg-canvas)] border border-[var(--color-border)] rounded-xl text-xs outline-none focus:border-[var(--color-text-dark)] transition-colors text-[var(--color-text-dark)]" />
        <button type="submit" class="px-5 py-3 bg-[var(--color-text-dark)] text-[var(--color-bg-canvas)] text-xs font-bold uppercase tracking-wider rounded-xl hover:opacity-90 transition-all">Subscribe</button>
      </form>
    </div>
  </div>

  <!-- Divider and Copyright -->
  <div class="max-w-7xl mx-auto px-8">
    <div class="border-t border-[var(--color-border)] py-6 text-center text-[10px] tracking-wider text-[var(--color-text-muted)]">
      &copy; 2026 VINTCAM Inc. Crafted to precise analog engineering standards. All Rights Reserved.
    </div>
  </div>
</footer>
`;

const EXCEPTIONS = ['checkout.html', '404.html', 'maintainance.html'];

function compileFile(filePath, isRoot = false) {
  const fileName = path.basename(filePath);
  if (EXCEPTIONS.includes(fileName)) {
    console.log(`Skipping specialized page layout compilation for: ${fileName}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Resolve Paths
  const rootPath = isRoot ? './' : '../';
  const pagesPath = isRoot ? 'pages/' : './';

  let resolvedHeader = HEADER_TEMPLATE
    .replace(/ROOT_PATH/g, rootPath)
    .replace(/PAGES_PATH/g, pagesPath);

  let resolvedFooter = FOOTER_TEMPLATE
    .replace(/ROOT_PATH/g, rootPath)
    .replace(/PAGES_PATH/g, pagesPath);

  // Perform dynamic regex replacement for <header>...</header> and <footer>...</footer> blocks
  const headerRegex = /<header[\s\S]*?<\/header>/i;
  const footerRegex = /<footer[\s\S]*?<\/footer>/i;

  if (headerRegex.test(content)) {
    content = content.replace(headerRegex, resolvedHeader.trim());
  } else {
    console.warn(`[Warning] No <header> element found in: ${fileName}`);
  }

  if (footerRegex.test(content)) {
    content = content.replace(footerRegex, resolvedFooter.trim());
  } else {
    console.warn(`[Warning] No <footer> element found in: ${fileName}. Appending footer dynamically...`);
    const mainEndRegex = /<\/main>/i;
    if (mainEndRegex.test(content)) {
      content = content.replace(mainEndRegex, '\n' + resolvedFooter.trim() + '\n  </main>');
    } else {
      const bodyEndRegex = /<\/body>/i;
      if (bodyEndRegex.test(content)) {
        content = content.replace(bodyEndRegex, '\n' + resolvedFooter.trim() + '\n</body>');
      } else {
        console.error(`[Error] Could not find insertion point for footer in: ${fileName}`);
      }
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully compiled global header and footer in: ${fileName}`);
}

function run() {
  console.log('--- Starting Global Navbar & Footer Layout Compiler ---');

  // 1. Process root index.html
  const rootIndex = path.join(WORKSPACE_DIR, 'index.html');
  if (fs.existsSync(rootIndex)) {
    compileFile(rootIndex, true);
  } else {
    console.error('Error: index.html not found in root!');
  }

  // 2. Process all pages in the pages/ directory
  if (fs.existsSync(PAGES_DIR)) {
    const files = fs.readdirSync(PAGES_DIR);
    files.forEach(file => {
      if (file.endsWith('.html')) {
        compileFile(path.join(PAGES_DIR, file), false);
      }
    });
  } else {
    console.error('Error: pages/ directory not found!');
  }

  console.log('--- Compilation Overhaul Completed! ---');
}

run();
