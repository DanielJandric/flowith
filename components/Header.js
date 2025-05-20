// Header component rendering the navigation
function renderHeader(container) {
  if (!container) return;
  
  container.innerHTML = `
    <div class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <div class="text-3xl font-bold text-primary">
            <span class="text-dark">REAL ESTATE</span>METRICS
          </div>
        </div>
        <nav class="hidden md:flex space-x-6">
          <a href="#" class="text-dark hover:text-primary font-medium transition-colors">Dashboard</a>
          <a href="#" class="text-dark hover:text-primary font-medium transition-colors">Properties</a>
          <a href="#" class="text-dark hover:text-primary font-medium transition-colors">Analytics</a>
          <a href="#" class="text-dark hover:text-primary font-medium transition-colors">Reports</a>
        </nav>
        <div class="md:hidden">
          <button id="mobile-menu-button" class="text-dark hover:text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      <div id="mobile-menu" class="hidden md:hidden mt-4 pb-4">
        <div class="flex flex-col space-y-3">
          <a href="#" class="text-dark hover:text-primary font-medium transition-colors">Dashboard</a>
          <a href="#" class="text-dark hover:text-primary font-medium transition-colors">Properties</a>
          <a href="#" class="text-dark hover:text-primary font-medium transition-colors">Analytics</a>
          <a href="#" class="text-dark hover:text-primary font-medium transition-colors">Reports</a>
        </div>
      </div>
    </div>
  `;
  
  // Mobile menu toggle
  const mobileMenuButton = container.querySelector('#mobile-menu-button');
  const mobileMenu = container.querySelector('#mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}







