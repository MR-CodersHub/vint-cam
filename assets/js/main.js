/**
 * VINTCAM — Main UI Engine & Premium Interactive Controllers
 */
document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  checkLayoutDirection();
  initStickyHeader();
  initActiveLinks();
  initProfileDropdown();
});

/**
 * Syncs UI theme state with localStorage or System Preferences
 */
function initThemeEngine() {
  const savedTheme = localStorage.getItem('vintcam_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let activeTheme = 'light';
  
  if (savedTheme) {
    activeTheme = savedTheme;
  } else if (systemPrefersDark) {
    activeTheme = 'dark';
  }
  
  document.documentElement.setAttribute('data-theme', activeTheme);
  updateThemeIcon(activeTheme);
}

/**
 * Global click action for the Light/Dark mode utility switch
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', targetTheme);
  localStorage.setItem('vintcam_theme', targetTheme);
  updateThemeIcon(targetTheme);
}

/**
 * Update the sun/moon toggler icons and classes
 */
function updateThemeIcon(theme) {
  const sunPath = document.getElementById('theme-sun-path');
  const moonPath = document.getElementById('theme-moon-path');
  if (!sunPath || !moonPath) return;

  if (theme === 'dark') {
    // Show Sun, Hide Moon
    sunPath.classList.remove('hidden');
    moonPath.classList.add('hidden');
  } else {
    // Show Moon, Hide Sun
    sunPath.classList.add('hidden');
    moonPath.classList.remove('hidden');
  }
}

/**
 * Checks for RTL (Right-to-Left) layouts to handle alignment changes
 */
function checkLayoutDirection() {
  const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
  if (isRTL) {
    document.body.classList.add('rtl-layout');
  }
}

/**
 * Sticky Glassmorphism Header Dynamics
 */
function initStickyHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  // Add scroll listener
  window.addEventListener('scroll', () => {
    if (window.scrollY > 15) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });
}

/**
 * Active Page Link Underline Highlighting
 */
function initActiveLinks() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Normalize path matches
    const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
    const linkName = href.substring(href.lastIndexOf('/') + 1) || 'index.html';
    
    if (pageName === linkName) {
      link.classList.add('nav-link-active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('nav-link-active');
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * Profile Dropdown Controller
 */
function initProfileDropdown() {
  const container = document.getElementById('profile-container');
  const dropdown = document.getElementById('profile-dropdown');
  if (!container || !dropdown) return;

  // Toggle on click
  window.toggleProfileDropdown = function(event) {
    if (event) event.stopPropagation();
    
    const isHidden = dropdown.classList.contains('hidden');
    if (isHidden) {
      dropdown.classList.remove('hidden');
      // Small timeout to allow transition to trigger
      setTimeout(() => {
        dropdown.classList.remove('opacity-0', 'scale-95');
        dropdown.classList.add('opacity-100', 'scale-100');
      }, 20);
    } else {
      closeDropdown();
    }
  };

  function closeDropdown() {
    dropdown.classList.remove('opacity-100', 'scale-100');
    dropdown.classList.add('opacity-0', 'scale-95');
    // Hide after animation finishes
    setTimeout(() => {
      dropdown.classList.add('hidden');
    }, 250);
  }

  // Click outside to close
  document.addEventListener('click', (event) => {
    if (!container.contains(event.target)) {
      closeDropdown();
    }
  });

  // Escape key to close
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeDropdown();
    }
  });
}

/**
 * Mobile Hamburger Menu Drawer Controller
 */
window.toggleMobileMenu = function() {
  const drawer = document.getElementById('mobile-menu-drawer');
  const content = document.getElementById('mobile-menu-content');
  if (!drawer || !content) return;

  const isHidden = drawer.classList.contains('hidden');
  if (isHidden) {
    // Open menu
    drawer.classList.remove('hidden');
    // Force reflow
    drawer.offsetHeight;
    drawer.classList.remove('opacity-0');
    drawer.classList.add('opacity-100');
    content.classList.remove('translate-x-full');
    content.classList.add('translate-x-0');
    document.body.classList.add('overflow-hidden');
  } else {
    // Close menu
    drawer.classList.remove('opacity-100');
    drawer.classList.add('opacity-0');
    content.classList.remove('translate-x-0');
    content.classList.add('translate-x-full');
    document.body.classList.remove('overflow-hidden');
    
    // Hide drawer after transition ends
    setTimeout(() => {
      drawer.classList.add('hidden');
    }, 300);
  }
};