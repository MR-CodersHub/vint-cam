/**
 * VINTCAM — Main UI Engine & Premium Interactive Controllers
 */
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