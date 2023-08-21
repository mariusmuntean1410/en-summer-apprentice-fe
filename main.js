import { fetchEventData,fetchOrdersData} from './src/components/api.js';
import { renderHomePage, renderOrdersPage} from './src/components/rendering.js';
import {addLoader,removeLoader} from './src/components/loader.js';

// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}



document.addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('increment')) {
    const quantityLabel = target.parentElement.querySelector('.quantity-label');
    quantityLabel.textContent = parseInt(quantityLabel.textContent) + 1;
  } else if (target.classList.contains('decrement')) {
    const quantityLabel = target.parentElement.querySelector('.quantity-label');
    const currentQuantity = parseInt(quantityLabel.textContent);
    if (currentQuantity > 0) {
      quantityLabel.textContent = currentQuantity - 1;
    }
  } else if (target.classList.contains('add-to-cart-btn')) {
    const eventCard = target.closest('.event-card');
    const ticketTypeSelect = eventCard.querySelector('.ticket-type');
    const quantityLabel = eventCard.querySelector('.quantity-label');
    
    
    quantityLabel.textContent = '0';
    
    
    ticketTypeSelect.selectedIndex = 0;
  }
});

// Setup navigation events
function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

// Setup mobile menu event
function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// Setup popstate event
function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

// Setup initial page
function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}

// Render content based on URL
async function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    const eventData = await fetchEventData();
    renderHomePage(eventData);
  } else if (url === '/orders') {
    const ordersData = await fetchOrdersData(); 
    renderOrdersPage(ordersData); 
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();











