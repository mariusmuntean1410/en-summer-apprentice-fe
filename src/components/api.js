export async function fetchEventData() {
    try {
      const response = await fetch('http://localhost:8080/event/all'); 
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const eventData = await response.json();
      return eventData;
    } catch (error) {
      console.error('Error fetching event data:', error);
      return []; 
    }
  }


  
  export async function fetchOrdersData() {
    try {
        const response = await fetch('http://localhost:8080/order/all'); 
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const ordersData = await response.json();
        return ordersData;
    } catch (error) {
        console.error('Error fetching orders data:', error);
        return [];
    }
}


export async function createOrder(selectedEventId, selectedTicketCategory, numberOfTickets) {
  const orderData = {
    eventId: selectedEventId,
    ticketCategoryId: selectedTicketCategory,
   numberOfTickets,
  };

  try {
    const response = await fetch('http://localhost:8080/order/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      const newOrder = await response.json();
      const ordersContainer = document.querySelector('.orders');

      const orderCard = renderOrderCard(newOrder);
      ordersContainer.appendChild(orderCard);
    } else {
      console.error('Failed to create order');
    }
  } catch (error) {
    console.error('Error creating order:', error);
  }
}

export function cancelOrder(orderId) {
  fetch(`http://localhost:7190/api/Order/Delete/${orderId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (response.ok) {
        
        console.log('Order canceled successfully');
      } else {
        throw new Error(`Failed to cancel order: ${response.statusText}`);
      }
    })
    .catch(error => {
      console.error('Error canceling order:', error);
    });
}

export async function fetchEventsFromBackend() {
  try {
    const response = await fetch('http://localhost:8080/event/all');
    if (response.ok) {
      const eventData = await response.json();
      return eventData;
    } else {
      throw new Error('Failed to fetch events');
    }
  } catch (error) {
    console.error('Error fetching events:', error);
  }
}

export async function fetchFilteredEvents(venueId, eventType) {
  try {
    const response = await fetch(`http://localhost:8080/event/specific?venueId=${venueId}&eventType=${eventType}`);
    if (response.ok) {
      const eventData = await response.json();
      return eventData;
  } else {
      toastr.error('An error occurred while fetching events. Please try again later.', 'Error');
      return [];
  }
} catch (error) {
  console.error('Error fetching or filtering events:', error);
  toastr.error('An error occurred while fetching events. Please try again later.', 'Error');
  return [];
}
}


export async function fetchTicketCategories(eventId) {
  try {
    const response = await fetch(`http://localhost:8080/ticketCategories/byEvent/${eventId}`);
    if (response.ok) {
      const ticketCategories = await response.json();
      return ticketCategories;
    } else {
      console.error('Failed to fetch ticket categories');
      return [];
    }
  } catch (error) {
    console.error('Error fetching ticket categories:', error);
    return [];
  }
}