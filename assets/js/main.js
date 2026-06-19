/**
 * VINTCAM — Main UI Engine & Premium Interactive Controllers
 */
// Configure CDN Tailwind CSS to use class-based dark mode so it matches our data-theme state
if (typeof tailwind !== 'undefined') {
  tailwind.config = {
    darkMode: 'class'
  };
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  checkLayoutDirection();
  initStickyHeader();
  initActiveLinks();
  initProfileDropdown();
  initCartEngine();
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
  if (activeTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  updateThemeIcon(activeTheme);
}

/**
 * Global click action for the Light/Dark mode utility switch
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', targetTheme);
  if (targetTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
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
 * Checks for RTL (Right-to-Left) layouts and sets state from localStorage
 */
function checkLayoutDirection() {
  const savedDir = localStorage.getItem('vintcam_dir') || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);
  if (savedDir === 'rtl') {
    document.body.classList.add('rtl-layout');
  } else {
    document.body.classList.remove('rtl-layout');
  }
}

/**
 * Toggles the layout direction (LTR <=> RTL) and persists to localStorage
 */
window.toggleRTL = function() {
  const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
  const targetDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
  document.documentElement.setAttribute('dir', targetDir);
  localStorage.setItem('vintcam_dir', targetDir);
  
  if (targetDir === 'rtl') {
    document.body.classList.add('rtl-layout');
  } else {
    document.body.classList.remove('rtl-layout');
  }
  window.dispatchEvent(new Event('dirchange'));
};

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

/**
 * Shopping Cart Engine — State Management & Real-time Renderers
 */
let cart = [];

window.initCartEngine = function() {
  const savedCart = localStorage.getItem('vintcam_cart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (e) {
      cart = [];
    }
  }
  updateCartUI();
};

window.toggleCartDrawer = function(forceOpen = null) {
  const drawer = document.getElementById('cart-drawer');
  const content = document.getElementById('cart-drawer-content');
  if (!drawer || !content) return;

  const isHidden = drawer.classList.contains('hidden');
  const shouldOpen = forceOpen !== null ? forceOpen : isHidden;

  if (shouldOpen) {
    drawer.classList.remove('hidden');
    drawer.offsetHeight; // Force reflow
    drawer.classList.remove('opacity-0');
    drawer.classList.add('opacity-100');
    content.classList.remove('translate-x-full');
    content.classList.add('translate-x-0');
    document.body.classList.add('overflow-hidden');
  } else {
    drawer.classList.remove('opacity-100');
    drawer.classList.add('opacity-0');
    content.classList.remove('translate-x-0');
    content.classList.add('translate-x-full');
    document.body.classList.remove('overflow-hidden');
    setTimeout(() => {
      drawer.classList.add('hidden');
    }, 300);
  }
};

window.addToCart = function(id, name, price, description = '', brand = 'Vintcam') {
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, name, price, description, brand, quantity: 1 });
  }

  // Save state
  localStorage.setItem('vintcam_cart', JSON.stringify(cart));
  
  // Update UI and badges
  updateCartUI();
  
  // Smooth bounce animation on the toggler cart button badge
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.classList.remove('scale-100');
    badge.classList.add('scale-125', 'bg-amber-500');
    setTimeout(() => {
      badge.classList.remove('scale-125', 'bg-amber-500');
      badge.classList.add('scale-100');
    }, 300);
  }

  // Slide open the cart drawer to give immediate interactive feedback
  setTimeout(() => {
    window.toggleCartDrawer(true);
  }, 150);
};

window.animateAddButton = function(btn) {
  if (!btn || btn.disabled) return;
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Added ✓';
  
  const isDynamicBtn = btn.classList.contains('bg-black') || btn.classList.contains('dark:bg-white');
  
  btn.classList.remove('bg-neutral-200', 'dark:bg-neutral-700', 'bg-black', 'dark:bg-white', 'text-white', 'text-black');
  btn.classList.add('bg-green-600', 'text-white');
  
  setTimeout(() => {
    btn.textContent = originalText;
    btn.classList.remove('bg-green-600', 'text-white');
    if (isDynamicBtn) {
      btn.classList.add('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black');
    } else {
      btn.classList.add('bg-neutral-200', 'dark:bg-neutral-700');
    }
    btn.disabled = false;
  }, 1000);
};

window.updateCartItemQuantity = function(id, delta) {
  const itemIndex = cart.findIndex(item => item.id === id);
  if (itemIndex === -1) return;

  cart[itemIndex].quantity += delta;
  
  if (cart[itemIndex].quantity <= 0) {
    cart.splice(itemIndex, 1);
  }

  localStorage.setItem('vintcam_cart', JSON.stringify(cart));
  updateCartUI();
};

window.removeFromCart = function(id) {
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('vintcam_cart', JSON.stringify(cart));
  updateCartUI();
};

function updateCartUI() {
  const badge = document.getElementById('cart-badge');
  const container = document.getElementById('cart-items-container');
  const subtotalLabel = document.getElementById('cart-subtotal');
  
  if (!container || !subtotalLabel) return;

  // Calculate total items and subtotal
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Update Badge Count
  if (badge) {
    if (totalItems > 0) {
      badge.textContent = totalItems;
      badge.classList.remove('scale-0');
      badge.classList.add('scale-100');
    } else {
      badge.classList.remove('scale-100');
      badge.classList.add('scale-0');
    }
  }

  // Render Items
  container.innerHTML = '';
  subtotalLabel.textContent = `$${subtotal.toFixed(2)}`;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-[var(--color-text-muted)] flex flex-col items-center justify-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 opacity-30 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <div>
          <p class="font-display text-base uppercase tracking-wider text-[var(--color-text-dark)]">Your cart is empty</p>
          <p class="text-[10px] mt-0.5" style="color: var(--color-text-muted);">Explore our vintage vault storage lots and developers to start adding stocks.</p>
        </div>
      </div>
    `;
    return;
  }

  cart.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = "flex items-center justify-between p-3 border rounded-xl bg-[var(--color-bg-card)] border-[var(--color-border)] group/item transition-colors duration-300";
    itemEl.innerHTML = `
      <div class="flex-1 min-w-0 pr-4 text-left">
        <div class="flex items-center gap-1.5 mb-0.5">
          <span class="text-[9px] font-mono tracking-tight text-amber-600 dark:text-amber-500 font-bold uppercase">${item.brand}</span>
        </div>
        <h4 class="font-display text-sm uppercase tracking-wide text-[var(--color-text-dark)] truncate leading-tight">${item.name}</h4>
        <span class="text-xs font-bold text-[var(--color-text-dark)]">$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
      
      <div class="flex items-center gap-2">
        <div class="flex items-center border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-bg-canvas)]">
          <button onclick="updateCartItemQuantity('${item.id}', -1)" class="px-2.5 py-1 text-xs hover:bg-[var(--color-bg-card)] transition-colors text-[var(--color-text-dark)] font-bold">-</button>
          <span class="px-2 text-xs font-bold text-[var(--color-text-dark)] min-w-[20px] text-center">${item.quantity}</span>
          <button onclick="updateCartItemQuantity('${item.id}', 1)" class="px-2.5 py-1 text-xs hover:bg-[var(--color-bg-card)] transition-colors text-[var(--color-text-dark)] font-bold">+</button>
        </div>
        <button onclick="removeFromCart('${item.id}')" class="p-1.5 hover:bg-red-500/10 rounded-lg group/trash text-[var(--color-text-muted)] hover:text-red-500 transition-colors" aria-label="Remove item">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    `;
    container.appendChild(itemEl);
  });
}

window.checkoutCart = function() {
  if (cart.length === 0) {
    alert("Your cart is empty. Please add items to checkout.");
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Custom styled visual feedback
  const overlay = document.createElement('div');
  overlay.className = "fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 opacity-0 transition-opacity duration-300";
  overlay.innerHTML = `
    <div class="bg-[#faf6ee] dark:bg-[#252829] border border-[#ded8cb] dark:border-[#33383a] p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl transform scale-95 transition-transform duration-300 flex flex-col items-center gap-4">
      <div class="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 class="font-display text-2xl uppercase tracking-widest text-[var(--color-text-dark)] leading-tight">Order Logged Successfully</h3>
      <p class="text-xs leading-relaxed" style="color: var(--color-text-muted);">
        Your analog replenishment order of <strong>$${total.toFixed(2)}</strong> has been cataloged. Our laboratory technicians are preparing your shipment under strict cold-storage protocols.
      </p>
      <button id="close-checkout-modal" class="w-full mt-2 py-3 bg-black text-white dark:bg-white dark:text-black font-semibold text-xs tracking-wider uppercase rounded-xl hover:opacity-90 transition-all">
        Acknowledge & Close
      </button>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Animate modal open
  setTimeout(() => {
    overlay.classList.remove('opacity-0');
    overlay.classList.add('opacity-100');
    overlay.firstElementChild.classList.remove('scale-95');
    overlay.firstElementChild.classList.add('scale-100');
  }, 20);

  // Close Cart Drawer
  window.toggleCartDrawer(false);

  // Reset Cart state
  cart = [];
  localStorage.removeItem('vintcam_cart');
  updateCartUI();

  // Close Modal Handler
  document.getElementById('close-checkout-modal').onclick = function() {
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0');
    overlay.firstElementChild.classList.remove('scale-100');
    overlay.firstElementChild.classList.add('scale-95');
    setTimeout(() => {
      overlay.remove();
    }, 300);
  };
};

/* ==========================================================================
   VINTCAM VINTAGE CAMERA DATABASE & CALIBRATION DYNAMICS
   ========================================================================== */

const VINTAGE_GEAR_DATABASE = {
  'LCA-M6-TI': {
    name: 'Leica M6 Titanium',
    brand: 'Leica',
    year: '1992',
    price: 3100.00,
    category: 'Rangefinders',
    image: '../assets/images/cam1.jpg',
    description: 'Special titanium finish edition of the iconic mechanical rangefinder. Fully overhauled and calibrated.',
    reportNo: 'REP-LCA-M6-9281',
    techSpecs: {
      'Mount Type': 'Leica M Mount',
      'Shutter': 'Horizontal mechanical cloth focal plane, 1s – 1/1000s + B',
      'Viewfinder': '0.72x magnification rangefinder with automatic parallax correction',
      'Exposure Metering': 'TTL center-weighted (silicon photodiode)',
      'Dimensions': '138 x 77 x 38 mm',
      'Weight': '560g'
    },
    calibration: {
      shutterTolerance: '±1.5% average variance',
      rangefinderAlign: '100% synchronized at infinity focus',
      opticalGrade: 'Grade A (No haze, zero separation, minimal dust)',
      lightSeals: '100% light-tight (new neoprene seals installed)'
    },
    shutterSpeeds: [
      { target: '1/1000s', actual: '1/985s', deviation: '-1.5%' },
      { target: '1/500s', actual: '1/508s', deviation: '+1.6%' },
      { target: '1/250s', actual: '1/250s', deviation: '0.0%' },
      { target: '1/125s', actual: '1/123s', deviation: '-1.6%' },
      { target: '1/60s', actual: '1/60s', deviation: '0.0%' },
      { target: '1s', actual: '1.02s', deviation: '+2.0%' }
    ],
    benchNotes: 'Retard gear train dismantled, ultrasonic cleaned and re-oiled with Moebius watch oil. Light meter calibrated to 1.5v battery parameters. Rangefinder prism beam splitter cleaned and horizontal alignment corrected.',
    inspector: 'Marcus Vance',
    inspectionDate: '2026-06-12'
  },
  'NIK-FM2-TI': {
    name: 'Nikon FM2 Titanium',
    brand: 'Nikon',
    year: '1984',
    price: 520.00,
    category: 'SLRs',
    image: '../assets/images/cam2.jpg',
    description: 'Niche mechanical SLR featuring titanium honeycomb shutter curtains. Speed calibrated up to 1/4000s.',
    reportNo: 'REP-NIK-FM2-1082',
    techSpecs: {
      'Mount Type': 'Nikon F Mount (AI/AI-S)',
      'Shutter': 'Vertical-travel titanium honeycomb focal plane, 1s – 1/4000s + B',
      'Viewfinder': 'Fixed eye-level pentaprism, 93% coverage, split-image microprism',
      'Exposure Metering': 'Center-weighted TTL (60/40), dual SPD cells',
      'Dimensions': '142.5 x 90 x 60 mm',
      'Weight': '540g'
    },
    calibration: {
      shutterTolerance: '±2.4% average variance',
      rangefinderAlign: 'Mirror index bumper synchronized at 45° angle',
      opticalGrade: 'Grade A- (Pristine mirror path, microscopic dust in finder)',
      lightSeals: '100% light-tight (replaced rear door and mirror dampeners)'
    },
    shutterSpeeds: [
      { target: '1/4000s', actual: '1/3880s', deviation: '-3.0%' },
      { target: '1/2000s', actual: '1/1950s', deviation: '-2.5%' },
      { target: '1/1000s', actual: '1/1012s', deviation: '+1.2%' },
      { target: '1/500s', actual: '1/500s', deviation: '0.0%' },
      { target: '1/125s', actual: '1/127s', deviation: '+1.6%' },
      { target: '1s', actual: '0.99s', deviation: '-1.0%' }
    ],
    benchNotes: 'Titanium shutter blades dry-lubricated with graphite compound. Speed springs retensioned. Mirror box lift mechanism serviced. Light meter cells calibrated within ±0.1 EV accuracy.',
    inspector: 'Helena Roslin',
    inspectionDate: '2026-06-15'
  },
  'ROL-TLR-28F': {
    name: 'Rolleiflex 2.8F TLR',
    brand: 'Rollei',
    year: '1965',
    price: 1850.00,
    category: 'Medium Format',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
    description: 'Iconic twin-lens reflex camera fitted with a legendary Carl Zeiss Planar 80mm f/2.8 taking lens.',
    reportNo: 'REP-ROL-TLR-0549',
    techSpecs: {
      'Taking Lens': 'Carl Zeiss Planar 80mm f/2.8 (5 elements in 4 groups)',
      'Viewing Lens': 'Heidosmat 80mm f/2.8 viewing lens',
      'Shutter': 'Synchro-Compur MXV leaf shutter, 1s – 1/500s + B',
      'Viewfinder': 'Waist-level finder with Maxwell bright screen update',
      'Exposure Metering': 'Dual-range selenium cell light meter (uncoupled)',
      'Dimensions': '112 x 148 x 105 mm',
      'Weight': '1,220g'
    },
    calibration: {
      shutterTolerance: '±4.1% average variance (exceptional leaf shutter spec)',
      rangefinderAlign: 'Viewing/taking lens focus planes matched on collimator bench',
      opticalGrade: 'Grade A (Carl Zeiss lens completely free of separation/haze)',
      lightSeals: 'Solid mechanical light seal channels verified'
    },
    shutterSpeeds: [
      { target: '1/500s', actual: '1/480s', deviation: '-4.0%' },
      { target: '1/250s', actual: '1/242s', deviation: '-3.2%' },
      { target: '1/125s', actual: '1/125s', deviation: '0.0%' },
      { target: '1/60s', actual: '1/62s', deviation: '+3.2%' },
      { target: '1/30s', actual: '1/30s', deviation: '0.0%' },
      { target: '1s', actual: '1.04s', deviation: '+4.0%' }
    ],
    benchNotes: 'Synchro-Compur shutter dial mechanism degreased. Leaf blade assembly cleaned of organic oil vapors. Focus guides re-tracked and focus knob friction updated. Maxwell bright screen installed.',
    inspector: 'Marcus Vance',
    inspectionDate: '2026-06-10'
  },
  'HAS-500CM': {
    name: 'Hasselblad 500C/M Planar 80mm',
    brand: 'Hasselblad',
    year: '1978',
    price: 2450.00,
    category: 'Medium Format',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800',
    description: 'Studio icon medium format camera with Carl Zeiss Planar 80mm f/2.8 lens and matching A12 back.',
    reportNo: 'REP-HAS-500-3490',
    techSpecs: {
      'Mount Type': 'Hasselblad V Mount',
      'Taking Lens': 'Carl Zeiss Planar 80mm f/2.8 T*',
      'Shutter': 'Synchro-Compur leaf shutter inside lens, 1s – 1/500s + B',
      'Viewfinder': 'Interchangeable waist-level finder, standard screen',
      'Film Back': 'A12 film back (12 exposures of 6x6cm format)',
      'Weight': '1,500g'
    },
    calibration: {
      shutterTolerance: '±3.2% average variance',
      rangefinderAlign: 'Flange back register calibrated within 0.02mm tolerance',
      opticalGrade: 'Grade A (Lens pristine, barrel marks only)',
      lightSeals: 'A12 magazine light trap seals fully replaced'
    },
    shutterSpeeds: [
      { target: '1/500s', actual: '1/485s', deviation: '-3.0%' },
      { target: '1/250s', actual: '1/255s', deviation: '+2.0%' },
      { target: '1/125s', actual: '1/125s', deviation: '0.0%' },
      { target: '1/60s', actual: '1/58s', deviation: '-3.3%' },
      { target: '1/30s', actual: '1/30s', deviation: '0.0%' },
      { target: '1s', actual: '1.02s', deviation: '+2.0%' }
    ],
    benchNotes: 'Rear safety barn-doors lubed and timing synchronized. A12 back gears adjusted for frame spacing accuracy. Carl Zeiss lens leaf shutter disassembled, blades degreased and reassembled.',
    inspector: 'Helena Roslin',
    inspectionDate: '2026-06-18'
  },
  'LCA-M4-CH': {
    name: 'Leica M4 Chrome Chassis',
    brand: 'Leica',
    year: '1968',
    price: 1950.00,
    category: 'Rangefinders',
    image: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&q=80&w=800',
    description: 'Fully mechanical rangefinder masterwork. Clean silver chrome chassis with classic mechanical design.',
    reportNo: 'REP-LCA-M4-0814',
    techSpecs: {
      'Mount Type': 'Leica M Mount',
      'Shutter': 'Horizontal mechanical cloth focal plane, 1s – 1/1000s + B',
      'Viewfinder': '0.72x magnification rangefinder with 35/50/90/135 framelines',
      'Exposure Metering': 'Fully mechanical (no battery, external meter compatible)',
      'Dimensions': '138 x 77 x 36 mm',
      'Weight': '545g'
    },
    calibration: {
      shutterTolerance: '±1.8% average variance',
      rangefinderAlign: 'Infinity overlay matched on optical collimator bench',
      opticalGrade: 'Grade A (Viewfinder glass polished, optics zero separation)',
      lightSeals: 'Solid mechanical baffle channels (no foam seals to degrade)'
    },
    shutterSpeeds: [
      { target: '1/1000s', actual: '1/988s', deviation: '-1.2%' },
      { target: '1/500s', actual: '1/506s', deviation: '+1.2%' },
      { target: '1/250s', actual: '1/250s', deviation: '0.0%' },
      { target: '1/125s', actual: '1/122s', deviation: '-2.4%' },
      { target: '1/60s', actual: '1/60s', deviation: '0.0%' },
      { target: '1s', actual: '1.01s', deviation: '+1.0%' }
    ],
    benchNotes: 'Mechanical retard gears cleaned of aged lubrication. Re-lubricated with Swiss synthetic oil. Rangefinder mirrors realigned for optimum contrast alignment. Outer vulcanite grip cleaned and detailed.',
    inspector: 'Marcus Vance',
    inspectionDate: '2026-06-08'
  },
  'NIK-F3-HP': {
    name: 'Nikon F3 HP SLR Body',
    brand: 'Nikon',
    year: '1982',
    price: 650.00,
    category: 'SLRs',
    image: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&q=80&w=800',
    description: 'Quartz-timed electronic professional SLR camera featuring the DE-3 high-eyepoint view prism.',
    reportNo: 'REP-NIK-F3-8831',
    techSpecs: {
      'Mount Type': 'Nikon F Mount (AI/AI-S/AF)',
      'Shutter': 'Quartz-controlled electronical titanium foil horizontal, 8s – 1/2000s',
      'Viewfinder': 'DE-3 High Eyepoint Pentaprism, 100% coverage frame',
      'Exposure Metering': 'TTL 80/20 center-weighted photodiode cell',
      'Dimensions': '148.5 x 96.5 x 65.5 mm',
      'Weight': '715g'
    },
    calibration: {
      shutterTolerance: '±0.4% average variance (quartz crystal accuracy)',
      rangefinderAlign: 'Mirror seat and bumper alignment verified',
      opticalGrade: 'Grade A- (Minor paint brassing on back cover, clean mirror box)',
      lightSeals: 'Door path foam light seals and mirror bumper replaced'
    },
    shutterSpeeds: [
      { target: '1/2000s', actual: '1/2008s', deviation: '+0.4%' },
      { target: '1/1000s', actual: '1/999s', deviation: '-0.1%' },
      { target: '1/500s', actual: '1/500s', deviation: '0.0%' },
      { target: '1/125s', actual: '1/125s', deviation: '0.0%' },
      { target: '1/60s', actual: '1/60s', deviation: '0.0%' },
      { target: '1s', actual: '1.00s', deviation: '0.0%' }
    ],
    benchNotes: 'Prism dampening foam strip replaced. Main switch circuitry cleaned of high-resistance surface oxides. Quartz oscillator timed on oscilloscope. Mechanical shutter release checked.',
    inspector: 'Helena Roslin',
    inspectionDate: '2026-06-17'
  },
  'ZSS-PL50-14': {
    name: 'Zeiss Planar 50mm f/1.4 ZS',
    brand: 'Zeiss',
    year: '2008',
    price: 450.00,
    category: 'Lenses',
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&q=80&w=800',
    description: 'Fast portrait prime lens with smooth manual focus helicoid and stunning resolving power.',
    reportNo: 'REP-ZSS-5014-99',
    techSpecs: {
      'Mount Type': 'M42 Screw Mount',
      'Optical Formula': 'Planar (7 elements in 6 groups)',
      'Aperture': 'f/1.4 to f/16 (9 blades)',
      'Filter Thread': '58 mm',
      'Weight': '350g'
    },
    calibration: {
      shutterTolerance: 'N/A (Lens focus calibration checks only)',
      rangefinderAlign: 'Focus barrel helicoid alignment verified to infinity stop',
      opticalGrade: 'Grade A (Glass is flawless, zero bubbles or separation)',
      lightSeals: 'Internal light baffles checked'
    },
    shutterSpeeds: [],
    benchNotes: 'Aperture blades degreased and verified dry. Focus helicoid ring repacked with high-damping lubricant to ensure exact feedback resistance. Front/rear lens elements multi-coating checked.',
    inspector: 'Marcus Vance',
    inspectionDate: '2026-06-11'
  },
  'LCA-SC35-20': {
    name: 'Summicron-M 35mm f/2 ASPH',
    brand: 'Leica',
    year: '1998',
    price: 2150.00,
    category: 'Lenses',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800',
    description: 'Reference-grade M-mount street prime lens. Lightweight, exceptionally sharp, with classic contrast.',
    reportNo: 'REP-LCA-3520-04',
    techSpecs: {
      'Mount Type': 'Leica M Mount',
      'Optical Formula': '7 elements in 5 groups (1 double-sided aspherical)',
      'Aperture': 'f/2 to f/16 (8 blades)',
      'Filter Thread': '39 mm (E39)',
      'Weight': '255g'
    },
    calibration: {
      shutterTolerance: 'N/A (Lens focus calibration checks only)',
      rangefinderAlign: 'Focus coupling cam synchronized with standard M body',
      opticalGrade: 'Grade A (No dust, zero micro-scratches, no element separation)',
      lightSeals: 'Rear bayonet seal tested'
    },
    shutterSpeeds: [],
    benchNotes: 'Aperture linkage spring calibrated. Rangefinder coupling cam tested across full range (0.7m to infinity). Internal lens barrel guide screws tightened to eliminate mechanical play.',
    inspector: 'Marcus Vance',
    inspectionDate: '2026-06-09'
  },
  'CAN-FD55-12': {
    name: 'Canon FD 55mm f/1.2 S.S.C.',
    brand: 'Canon',
    year: '1975',
    price: 380.00,
    category: 'Lenses',
    image: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&q=80&w=800',
    description: 'Vintage high-aperture standard lens featuring Canon Super Spectra Coating (S.S.C.) and signature bokeh.',
    reportNo: 'REP-CAN-5512-23',
    techSpecs: {
      'Mount Type': 'Canon FD Breaching Lock Mount',
      'Optical Formula': '7 elements in 5 groups',
      'Aperture': 'f/1.2 to f/16 (8 blades)',
      'Filter Thread': '58 mm',
      'Weight': '425g'
    },
    calibration: {
      shutterTolerance: 'N/A (Lens focus calibration checks only)',
      rangefinderAlign: 'FD breech lock spring tension and register verified',
      opticalGrade: 'Grade A- (Very light micro-dust, zero haze/fungus)',
      lightSeals: 'Super Spectra Coating element reflection index check passed'
    },
    shutterSpeeds: [],
    benchNotes: 'Aperture mechanism disassembled, blades degreased and cleaned. Breech-lock rotation spring tensioned. Optical elements cleaned. Barrel exterior detailed.',
    inspector: 'Helena Roslin',
    inspectionDate: '2026-06-14'
  }
};

window.openCalibrationReport = function(gearId) {
  const item = VINTAGE_GEAR_DATABASE[gearId];
  if (!item) {
    console.warn(`Gear ID ${gearId} not found in database.`);
    return;
  }

  // Prevent background scroll
  document.body.classList.add('overflow-hidden');

  // Create Modal element
  const overlay = document.createElement('div');
  overlay.className = "fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 calibration-modal-overlay";
  overlay.id = "calibration-modal";

  // Build shutter speeds dynamic printout
  let shutterSection = '';
  if (item.shutterSpeeds && item.shutterSpeeds.length > 0) {
    let speedRows = item.shutterSpeeds.map(speed => `
      <tr class="border-b border-[var(--color-border)]/50">
        <td class="py-1.5 font-bold">${speed.target}</td>
        <td class="py-1.5 text-center">${speed.actual}</td>
        <td class="py-1.5 text-right font-bold ${speed.deviation.startsWith('-') ? 'text-blue-600 dark:text-blue-400' : speed.deviation === '0.0%' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-500'}">${speed.deviation}</td>
      </tr>
    `).join('');

    shutterSection = `
      <div class="mt-6 border-t border-[var(--color-border)] pt-4">
        <h4 class="text-[10px] uppercase font-bold tracking-wider text-amber-600 mb-2">✦ Live Shutter Speed Timing Log</h4>
        <table class="w-full text-[11px] font-mono-log text-[var(--color-text-dark)]">
          <thead>
            <tr class="border-b border-[var(--color-border)] text-left text-[9px] uppercase tracking-wider text-[var(--color-text-muted)]">
              <th class="pb-1">Target Speed</th>
              <th class="pb-1 text-center">Actual Measured</th>
              <th class="pb-1 text-right">Deviation</th>
            </tr>
          </thead>
          <tbody>
            ${speedRows}
          </tbody>
        </table>
      </div>
    `;
  }

  // Build spec metrics
  const specRows = Object.entries(item.techSpecs).map(([key, val]) => `
    <div class="flex justify-between items-baseline gap-2 py-1 border-b border-dashed border-[var(--color-border)]/60 text-[11px]">
      <span class="font-bold text-[var(--color-text-muted)] uppercase text-[9px] tracking-wide">${key}</span>
      <span class="text-right font-mono-log text-[var(--color-text-dark)]">${val}</span>
    </div>
  `).join('');

  // Choose Technician stamp signature
  const sigStyle = item.inspector === 'Marcus Vance' ? 'font-serif-ital text-lg' : 'font-display text-md text-amber-800 dark:text-amber-400';

  overlay.innerHTML = `
    <div class="relative w-full max-w-4xl bg-[#faf6ee] dark:bg-[#1e2021] border-2 border-[#ded8cb] dark:border-[#3b3f41] rounded-2xl shadow-2xl overflow-hidden calibration-modal-container max-h-[92vh] flex flex-col transition-colors duration-300">
      
      <!-- Top Lab Header Bar -->
      <div class="p-4 sm:px-6 bg-[#f1ede2] dark:bg-[#151718] border-b border-[var(--color-border)] flex items-center justify-between transition-colors duration-300">
        <div class="flex items-center gap-3">
          <div class="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></div>
          <span class="font-mono-log text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-dark)]">Vintcam Optomechanical Lab // Spec Sheet</span>
        </div>
        <button onclick="closeCalibrationReport()" class="p-1.5 border border-[var(--color-border)] rounded-full hover:bg-[var(--color-bg-card)] transition-all flex items-center justify-center group" aria-label="Close report">
          <svg class="h-4 w-4 text-[var(--color-text-dark)] transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Main Scrollable Content -->
      <div class="p-6 sm:p-8 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Left: Image & Specs -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="relative w-full aspect-square bg-neutral-900 rounded-xl overflow-hidden shadow-inner border border-[var(--color-border)]">
            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black/10 pointer-events-none"></div>
            
            <!-- Rubber Stamp Overlay -->
            <div class="absolute bottom-4 right-4">
              <span class="calibration-stamp stamp-certified text-xs">Calibrated & Approved</span>
            </div>
          </div>
          
          <div>
            <span class="text-[10px] font-mono-log tracking-tight text-amber-600 block mb-1 font-bold">${item.reportNo}</span>
            <span class="text-xs uppercase font-bold tracking-widest text-[var(--color-text-muted)]">${item.brand} • ${item.year}</span>
            <h2 class="font-display text-3xl uppercase tracking-wider text-[var(--color-text-dark)] mb-2 mt-1 leading-tight">${item.name}</h2>
            <p class="text-xs leading-relaxed" style="color: var(--color-text-muted);">${item.description}</p>
          </div>
        </div>

        <!-- Right: Technical Logs -->
        <div class="lg:col-span-7 flex flex-col justify-between">
          <div>
            <h3 class="font-display text-xl uppercase tracking-wide border-b border-[var(--color-border)] pb-2 mb-4 text-[var(--color-text-dark)]">Optomechanical Inspection Profile</h3>
            
            <!-- Tech Specs List -->
            <div class="flex flex-col gap-1 mb-6">
              ${specRows}
            </div>

            <!-- Diagnostics Metrics -->
            <div class="bg-[#f5f1e6] dark:bg-[#252829] border border-[var(--color-border)] p-4 rounded-xl flex flex-col gap-3 font-mono-log text-[11px] transition-colors duration-300">
              <div class="flex justify-between">
                <span class="font-bold text-[var(--color-text-muted)]">SHUTTER ACCURACY:</span>
                <span class="font-bold text-emerald-600 dark:text-emerald-400">${item.calibration.shutterTolerance}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-bold text-[var(--color-text-muted)]">FOCUS & ALIGNMENT:</span>
                <span class="font-bold text-emerald-600 dark:text-emerald-400">${item.calibration.rangefinderAlign}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-bold text-[var(--color-text-muted)]">OPTICAL ELEMENTS:</span>
                <span class="font-bold text-emerald-600 dark:text-emerald-400">${item.calibration.opticalGrade}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-bold text-[var(--color-text-muted)]">CHASSIS LIGHT SEALS:</span>
                <span class="font-bold text-emerald-600 dark:text-emerald-400">${item.calibration.lightSeals}</span>
              </div>
            </div>

            <!-- Shutter Speeds Block -->
            ${shutterSection}
            
            <!-- Bench Technician Logs -->
            <div class="mt-6 border-t border-[var(--color-border)] pt-4">
              <h4 class="text-[10px] uppercase font-bold tracking-wider text-amber-600 mb-1 font-bold">✦ Bench Overhaul & Restoration Notes</h4>
              <p class="text-xs leading-relaxed italic" style="color: var(--color-text-muted);">${item.benchNotes}</p>
            </div>
          </div>

          <!-- Inspector Signoff Stamp & Action -->
          <div class="mt-8 pt-4 border-t border-[var(--color-border)] flex flex-wrap gap-4 items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="border border-dashed border-[var(--color-border)] p-2 rounded bg-[#f5f1e6] dark:bg-[#151718] text-center min-w-[120px] transition-colors duration-300">
                <span class="block text-[8px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Bench Technologist</span>
                <span class="${sigStyle} block text-amber-700 dark:text-amber-400 font-bold">${item.inspector}</span>
                <span class="block text-[8px] font-mono-log mt-0.5 text-[var(--color-text-muted)]">${item.inspectionDate}</span>
              </div>
            </div>
            
            <div class="flex items-center gap-3 flex-1 justify-end">
              <span class="font-display text-2xl tracking-wider text-[var(--color-text-dark)] mr-2">$${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              <button onclick="addToCart('${item.name.replace(/'/g, "\\'")}', '${item.name.replace(/'/g, "\\'")}', ${item.price}, '${item.description.replace(/'/g, "\\'")}', '${item.brand}'); animateAddButton(this); setTimeout(closeCalibrationReport, 350)" class="px-6 py-3.5 bg-black text-white dark:bg-white dark:text-black font-semibold text-xs tracking-wider uppercase rounded-xl hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2">
                Acquire Gear Spec &rarr;
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Focus modal trap & escape listeners
  document.addEventListener('keydown', onEscKeyClose);
  overlay.addEventListener('click', onClickOutsideClose);
};

window.closeCalibrationReport = function() {
  const overlay = document.getElementById('calibration-modal');
  if (!overlay) return;

  document.body.classList.remove('overflow-hidden');
  
  overlay.classList.add('opacity-0');
  overlay.firstElementChild.style.transform = 'scale(0.96) translateY(10px)';
  overlay.firstElementChild.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
  
  setTimeout(() => {
    overlay.remove();
  }, 300);

  document.removeEventListener('keydown', onEscKeyClose);
};

function onEscKeyClose(e) {
  if (e.key === 'Escape') {
    window.closeCalibrationReport();
  }
}

function onClickOutsideClose(e) {
  const modal = document.getElementById('calibration-modal');
  if (e.target === modal) {
    window.closeCalibrationReport();
  }
}