import { createOrder, cancelOrder, fetchEventsFromBackend, fetchFilteredEvents, fetchTicketCategories} from './api.js'; 
  
  
  
  function getHomePageTemplate() {
      return `
      <div id="content" class="text-center">
      <img src="./src/assets/mainpage.png" alt="summer">
      <div class="filter-controls flex flex-col items-center mt-4">
        <div class="filter-section event-filters mb-4">
          <label class="block text-gray-700 font-bold">Filter by Event Type:</label>
          <input type="checkbox" id="concert" value="Festival de muzica" class="mr-2"> Festival de muzica
          <input type="checkbox" id="sports" value="Bauturi" class="mr-2"> Bauturi
          <input type="checkbox" id="theater" value="Sport" class="mr-2"> Sport
        </div>
        <div class="filter-section venue-filter mb-4">
          <label for="venue" class="block text-gray-700 font-bold">Filter by Venue:</label>
          <select id="venue" class="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300">
            <option value="1">Aleea Stadionului 2, Cluj-Napoca</option>
            <option value="2">Bontida Castle, Cluj-Napoca</option>
            <option value="3">Central Park, Cluj-Napoca</option>
            <option value="4">Intre Lacuri, Cluj-Napoca</option>
          </select>
        </div>
        <button id="applyFiltersBtn" class="p-2 bg-custom-color text-white rounded">Apply Filters</button>
      </div>
      <div class="filter-section mt-4">
        <label for="eventFilter" class="block text-gray-700 font-bold">Filter by Event Name:</label>
        <input type="text" id="eventFilter" class="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300" placeholder="Search...">
      </div>
      <div class="events flex items-center justify-center flex-wrap mt-4">
        <!-- Event cards will be appended here -->
      </div>
    </div>
        
      `;
    }
    function getOrdersPageTemplate() {
      return `
        <div id="content">
          <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
          <div class="orders"> <!-- This is the container for order cards -->
          </div>
        </div>
      `;
    }

   

    function renderEventCard(event) {
      const eventCard = document.createElement('div');
      eventCard.classList.add('event-card');
    
      const eventImageUrls = {
        1: 'https://upload.wikimedia.org/wikipedia/en/0/06/Untold_logo.png',
        2: 'https://photos.bandsintown.com/large/13823021.jpeg',
        3: 'https://img.freepik.com/premium-vector/soccer-football-logo-vector_7888-111.jpg',
        4: 'https://www.chiaragiorleo.com/wp-content/uploads/2019/04/only-wine-fest-logo-1140x664.jpg',

      };
    
      const eventIndex = event.eventId; 
      
      const contentMarkup = `
        <header>
          <h2 class="event-title text-2xl font-bold">${event.eventName}</h2>
        </header>
        <div class="content">
          <img src="${eventImageUrls[eventIndex] || 'URL_IMAGINE_LIPSA'}" alt="${event.eventName}" class="event-image w-full height-200 rounded object-cover mb-4">
          <p class="description text-gray-700">${event.eventDescription}</p>
          <p class="date">${formatDate(event.startDate)} - ${formatDate(event.endDate)}</p>
          
          <div class="ticket-dropdown">
  <select class="ticket-type">
    ${
      event.ticketCategories.length === 1
        ? `<option value="${event.ticketCategories[0].ticketCategoryId}" data-ticket-category="${event.ticketCategories[0].ticketCategoryId}">
              ${event.ticketCategories[0].description} - Price: $${event.ticketCategories[0].price}
            </option>`
        : event.ticketCategories.map(category => `
            <option value="${category.ticketCategoryId}" data-ticket-category="${category.ticketCategoryId}">
              ${category.description} - Price: $${category.price}
            </option>`
          ).join('')
    }
  </select>
</div>
      
        <div class="quantity">
          <button class="decrement">-</button>
          <span class="quantity-label">0</span>
          <button class="increment">+</button>
        </div>
        
      <button class="add-to-cart-btn">Add to Cart</button>
        </div>
      `;
     
    
      
      
    
      eventCard.innerHTML = contentMarkup;
      return eventCard;
    }
    
    export function renderOrderCard(order, ticketCategories) {
      const orderCard = document.createElement('div');
      orderCard.classList.add('order-card');
      orderCard.setAttribute('data-order-id', order.orderId);

      const numberOfTicketsDisplay = document.createElement('p');
      numberOfTicketsDisplay.textContent = `Number of Tickets: ${order.numberOfTickets}`;
      const numberOfTicketsEdit = document.createElement('input');
      numberOfTicketsEdit.type = 'number';
      numberOfTicketsEdit.value = order.numberOfTickets;
      numberOfTicketsEdit.classList.add('hidden');
    
      const ticketCategoryDisplay = document.createElement('p');
      ticketCategoryDisplay.textContent = `Ticket Category: ${order.ticketCategoryDescription}`;
      const ticketCategorySelect = document.createElement('select');
      ticketCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.ticketCategoryId;
        option.textContent = `${category.description}`;
        ticketCategorySelect.appendChild(option);
      });
      ticketCategorySelect.classList.add('hidden');
  
  const contentMarkup = `
  <div class="order-details">
    <p><strong>Order ID:</strong> ${order.orderId}</p>
    <p><strong>Event ID:</strong> ${order.eventId}</p>
    <p><strong>Customer Name:</strong> ${order.customerName}</p>
    <p><strong>Ordered At:</strong> ${formatDateOrder(order.orderedAt)}</p>
    <p><strong>Number of Tickets:</strong> 
      <span class="display-field">${order.numberOfTickets}</span>
      <input type="number" class="edit-field edit-quantity hidden" min="0" value="${order.numberOfTickets}">
    </p>
    <p><strong>Total Price:</strong> ${order.totalPrice}</p>
    <p><strong>Ticket Category:</strong> 
      <span class="display-field">${order.ticketCategoryDescription}</span>
      <select class="edit-field edit-ticket-type hidden">
        ${
          ticketCategories.map(category => `
            <option value="${category.ticketCategoryId}">
              ${category.description} 
            </option>
          `).join('')
        }
      </select>
    </p>
  </div>
  <div class="edit-order-fields hidden">
    <button class="cancel-edit-btn">Cancel</button>
    <button class="save-edit-btn">Save</button>
  </div>
  <button class="edit-order-btn">Edit Order</button>
  <button class="cancel-order-btn">Delete Order</button>
`;
    
      orderCard.innerHTML = contentMarkup;
      return orderCard;
    }



    export function renderHomePage(eventData) {
      const mainContentDiv = document.querySelector('.main-content-component');
      mainContentDiv.innerHTML = getHomePageTemplate();
      const eventFilterInput = document.getElementById('eventFilter');
      const eventsContainer = document.querySelector('.events');
      const eventFilterByParameters = document.getElementById('applyFiltersBtn');
      const initialEventsContainerDisplay = eventsContainer.style.display;
      
      renderFilteredEvents(eventData);
    
      
      eventFilterByParameters.addEventListener('click', async () => {
        const selectedEventTypes = Array.from(document.querySelectorAll('.event-filters input:checked')).map(input => input.value);
        const selectedVenue = document.getElementById('venue').value;
    
        try {
          const filteredEvents = await fetchFilteredEvents(selectedVenue, selectedEventTypes);
          if (filteredEvents.length === 0) {
            eventsContainer.style.display = 'none';
            toastr.warning('No event matches the selected filter. Please try different criteria.', 'No Matching Events');
          } else {
            renderFilteredEvents(filteredEvents);
            eventsContainer.style.display = initialEventsContainerDisplay;
          }
        } catch (error) {
          console.error('Error fetching or filtering events:', error);
        }
      });
    
      
      eventFilterInput.addEventListener('input', async () => {
        const filterText = eventFilterInput.value;
    
        try {
          const eventData = await fetchEventsFromBackend();
          const filteredEvents = eventData.filter(event => event.eventName.toLowerCase().includes(filterText.toLowerCase()));
          renderFilteredEvents(filteredEvents);
        } catch (error) {
          console.error('Error fetching or filtering events:', error);
        }
      });
    
   
      eventsContainer.addEventListener('click', (event) => {
        const target = event.target;
    
        if (target.classList.contains('add-to-cart-btn')) {
          const eventCard = target.closest('.event-card');
          const ticketTypeSelect = eventCard.querySelector('.ticket-type');
          const selectedOption = ticketTypeSelect.options[ticketTypeSelect.selectedIndex];
          const selectedEventId = eventCard.dataset.eventId;
          const selectedTicketCategory = selectedOption.getAttribute('data-ticket-category');
          const selectedNumberOfTickets = parseInt(eventCard.querySelector('.quantity-label').textContent, 10);
    
          createOrder(selectedEventId, selectedTicketCategory, selectedNumberOfTickets);
        }
      });
    
   
      function renderFilteredEvents(events) {
        eventsContainer.innerHTML = '';
    
        if (events.length === 0) {
          toastr.warning('No event matches the selected filter. Please try different criteria.', 'No Matching Events');
        } else {
          events.forEach(event => {
            const eventCard = renderEventCard(event);
            eventsContainer.appendChild(eventCard);
          });
        }
       
      }
    }



  function formatDate(dateArray) {
      const [year, month, day] = dateArray;
      const formattedDate = new Date(year, month - 1, day).toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return formattedDate;
    }
    function formatDateOrder(dateString) {
      const [year, month, day, hour, minute] = dateString;
      const formattedDateString = new Date(year, month - 1, day, hour, minute).toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      });
      return formattedDateString;
    }
  
    
    
    
    export async function renderOrdersPage(ordersData) {
      const mainContentDiv = document.querySelector('.main-content-component');
      mainContentDiv.innerHTML = getOrdersPageTemplate();
    
      const ordersContainer = document.querySelector('.orders');
      try {
      
        ordersData.forEach(async (order) => {
          const eventId = order.eventId; 
          const ticketCategories = await fetchTicketCategories(eventId);
      
          const orderCard = renderOrderCard(order, ticketCategories);
          orderCard.setAttribute('data-order-id', order.orderId);
          ordersContainer.appendChild(orderCard);

          const cancelOrderButton = orderCard.querySelector('.cancel-order-btn');
          cancelOrderButton.addEventListener('click', async () => {
            const orderId = order.orderId;
            try {
              await cancelOrder(orderId);
              ordersContainer.removeChild(orderCard);
            } catch (error) {
              console.error('Error canceling order:', error);
            }
          });
          const editOrderButton = orderCard.querySelector('.edit-order-btn');
          const displayFields = orderCard.querySelectorAll('.display-field');
          const editFieldsContainer = orderCard.querySelector('.edit-order-fields');
          const editQuantityField = orderCard.querySelector('.edit-quantity');
          const editTicketTypeField = orderCard.querySelector('.edit-ticket-type');
          const cancelEditButton = orderCard.querySelector('.cancel-edit-btn');
          const saveEditButton = orderCard.querySelector('.save-edit-btn');
    
         
          editFieldsContainer.classList.add('hidden');
          editQuantityField.classList.add('hidden');
          editTicketTypeField.classList.add('hidden');
          cancelEditButton.classList.add('hidden');
          saveEditButton.classList.add('hidden');
    
          editOrderButton.addEventListener('click', () => {
           
            displayFields.forEach(field => field.classList.add('hidden'));
            editFieldsContainer.classList.remove('hidden');
            editQuantityField.classList.remove('hidden');
            editTicketTypeField.classList.remove('hidden');
            cancelEditButton.classList.remove('hidden');
            saveEditButton.classList.remove('hidden');
            editOrderButton.classList.add('hidden');
            cancelOrderButton.classList.add('hidden');
          });
    
          cancelEditButton.addEventListener('click', () => {
           
            displayFields.forEach(field => field.classList.remove('hidden'));
            editFieldsContainer.classList.add('hidden');
            editQuantityField.classList.add('hidden');
            editTicketTypeField.classList.add('hidden');
            cancelEditButton.classList.add('hidden');
            saveEditButton.classList.add('hidden');
            editOrderButton.classList.remove('hidden');
            cancelOrderButton.classList.remove('hidden');
          });
    
          saveEditButton.addEventListener('click', async () => {
            const newNumberOfTickets = parseInt(editQuantityField.value, 10);
            const newTicketCategoryId = editTicketTypeField.value;
        
            try {
                const orderToUpdate = {
                    OrderId: parseInt(orderCard.getAttribute('data-order-id')),
                    NumberOfTickets: newNumberOfTickets,
                    TicketCategoryId: newTicketCategoryId
                };
        
                const response = await fetch(`http://localhost:7190/api/Order/Patch`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderToUpdate)
                });
        
                if (!response.ok) {
                   
                    console.error('Error updating order:', response.statusText);
                    return;
                }
        
                
                displayFields[0].textContent = `${newNumberOfTickets}`;
              
                const selectedCategory = ticketCategories.find(category => category.ticketCategoryId ===parseInt(newTicketCategoryId));
              console.log(" Selected Category:",selectedCategory);
              
              if (selectedCategory) {
                displayFields[1].textContent = `${selectedCategory.description}`;
                const newTotalPrice = newNumberOfTickets * selectedCategory.price;
            
                const ticketCategoryPriceField = orderCard.querySelector('.order-details p:nth-last-child(2)');
                ticketCategoryPriceField.innerHTML = `<strong>Total Price:</strong> ${newTotalPrice}`;
            
                console.log('New total price:', newTotalPrice);
            }
               
                

                displayFields.forEach(field => field.classList.remove('hidden'));
                editFieldsContainer.classList.add('hidden');
                editQuantityField.classList.add('hidden');
                editTicketTypeField.classList.add('hidden');
                cancelEditButton.classList.add('hidden');
                saveEditButton.classList.add('hidden');
                editOrderButton.classList.remove('hidden');
                cancelOrderButton.classList.remove('hidden');
            } catch (error) {
                console.error('Error updating order:', error);
            }
        });
    
       
        });
      } catch (error) {
        console.error('Error fetching ticket categories:', error);
      }
    }

    
 