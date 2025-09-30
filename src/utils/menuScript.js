const menuItems = [{
    id: 1,
    name: 'Hamburguesa Clásica',
    price: 25000,
    category: 'hamburguesas',
    popular: true,
    image: '../../../public/ProductosMenu/Hamburguesa.jpg'
},
{
    id: 2,
    name: 'Alitas BBQ (8 pz)',
    price: 32000,
    category: 'alitas',
    popular: true,
    image: '../../../public/ProductosMenu/AlitasConPapas.jpg'
},
{
    id: 3,
    name: 'Papas a la francesa',
    price: 8000,
    category: 'papas',
    popular: false,
    image: '../../../public/ProductosMenu/Productoextra.jpg'
},
{
    id: 4,
    name: 'Mojitos',
    price: 18000,
    category: 'cocteles',
    popular: false,
    image: '../../../public/ProductosMenu/Coctel.jpg'
},
{
    id: 5,
    name: 'Corona',
    price: 7000,
    category: 'cervezas',
    popular: false,
    image: '../../../public/ProductosMenu/Corona.png'
},
{
    id: 6,
    name: 'Perro Americano',
    price: 6000,
    category: 'perro',
    popular: false,
    image: '../../../public/ProductosMenu/Perro.jpg'
},
{
    id: 7,
    name: 'Mojito de mango',
    price: 6000,
    category: 'cocteles',
    popular: true,
    image: '../../../public/ProductosMenu/Coctel3.jpg'
}
];

const BASE_PRICE = 5000;
const ingredientPrices = {
    beef: 8000,
    chicken: 7000,
    cheddar: 2000,
    lettuce: 500,
    tomato: 800,
    onion: 600,
    bbq: 1000
};

const menuGrid = document.querySelector('.menu-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const orderItemsContainer = document.querySelector('.order-items');
const totalPriceElement = document.getElementById('total-price');

let order = [];
let total = 0;
let customBurgerIngredients = [];

function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price);
}

function renderMenuItems(items) {
    menuGrid.innerHTML = '';
    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('menu-item');
        itemDiv.setAttribute('data-id', item.id);

        const customButton = item.category === 'hamburguesas' ?
            '<button class="customize-btn" data-action="customize">Personalizar</button>' : '';

        itemDiv.innerHTML = `
            <div class="item-image-container">
                <img src="${item.image}" alt="${item.name}">
                ${item.popular ? '<span class="popular-tag">Popular</span>' : ''}
            </div>
            <div class="item-info">
                <h4>${item.name}</h4>
                <p class="item-price">${formatPrice(item.price)}</p>
                ${customButton}
            </div>
        `;
        menuGrid.appendChild(itemDiv);
    });
}

function filterItems(category) {
    const filteredItems = category === 'todos' ? menuItems : menuItems.filter(item => item.category === category);
    renderMenuItems(filteredItems);
}

function openBurgerModal() {
    const modal = document.getElementById('burger-modal');
    if (modal) {
        modal.style.display = 'flex';
        modal.style.zIndex = '999999';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        resetCustomBurger();
    }
}

function closeBurgerModal() {
    const modal = document.getElementById('burger-modal');
    if (modal) {
        modal.classList.add('closing');
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('closing');
        }, 300);
    }
}

function resetCustomBurger() {
    customBurgerIngredients = [];
    const nameInput = document.getElementById('custom-burger-name');
    if (nameInput) nameInput.value = '';

    const checkboxes = document.querySelectorAll('#burger-modal input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);

    const radios = document.querySelectorAll('#burger-modal input[type="radio"]');
    radios.forEach(radio => radio.checked = false);

    updateBurgerPreview();
    updateCustomPrice();
}

function toggleIngredient(ingredient) {
    const index = customBurgerIngredients.indexOf(ingredient);
    if (index > -1) {
        customBurgerIngredients.splice(index, 1);
    } else {
        if (['beef', 'chicken'].includes(ingredient)) {
            customBurgerIngredients = customBurgerIngredients.filter(ing => !['beef', 'chicken'].includes(ing));
        }
        customBurgerIngredients.push(ingredient);
    }
    updateBurgerPreview();
    updateCustomPrice();
}

function updateBurgerPreview() {
    const preview = document.getElementById('burger-preview');
    if (!preview) return;

    const ingredientEmojis = {
        beef: '🥩',
        chicken: '🍗',
        cheddar: '🧀',
        lettuce: '🥬',
        tomato: '🍅',
        onion: '🧅',
        bbq: '🍯'
    };

    let previewHTML = '<div class="bun-top">🍞</div>';
    customBurgerIngredients.forEach(ingredient => {
        previewHTML += `<div class="ingredient-layer">${ingredientEmojis[ingredient]}</div>`;
    });
    previewHTML += '<div class="bun-bottom">🍞</div>';

    preview.innerHTML = previewHTML;
}

function updateCustomPrice() {
    let totalPrice = BASE_PRICE;
    customBurgerIngredients.forEach(ingredient => {
        totalPrice += ingredientPrices[ingredient] || 0;
    });
    const totalElement = document.getElementById('custom-total');
    if (totalElement) {
        totalElement.textContent = formatPrice(totalPrice);
    }
}

function addCustomBurger() {
    if (customBurgerIngredients.length === 0) {
        alert('Selecciona al menos un ingrediente');
        return;
    }

    const nameInput = document.getElementById('custom-burger-name');
    const burgerName = nameInput ? nameInput.value.trim() || 'Mi Hamburguesa Personalizada' : 'Mi Hamburguesa Personalizada';

    let totalPrice = BASE_PRICE;
    customBurgerIngredients.forEach(ingredient => {
        totalPrice += ingredientPrices[ingredient] || 0;
    });

    const customBurger = {
        id: Date.now(),
        name: burgerName,
        price: totalPrice,
        category: 'hamburguesas',
        custom: true,
        ingredients: [...customBurgerIngredients]
    };

    order.push(customBurger);
    updateOrderSummary();
    closeBurgerModal();
    showAddedNotification(burgerName);
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterItems(btn.getAttribute('data-category'));
    });
});

menuGrid.addEventListener('click', (e) => {
    // Si se hace clic en el botón de personalizar
    if (e.target.classList.contains('customize-btn') || e.target.getAttribute('data-action') === 'customize') {
        e.preventDefault();
        e.stopPropagation();
        openBurgerModal();
        return;
    }

    // Si se hace clic en cualquier otra parte del item (excepto el botón personalizar)
    const itemCard = e.target.closest('.menu-item');
    if (itemCard && !e.target.classList.contains('customize-btn')) {
        const itemId = parseInt(itemCard.getAttribute('data-id'));
        const itemToAdd = menuItems.find(item => item.id === itemId);

        if (itemToAdd) {
            order.push(itemToAdd);
            updateOrderSummary();
            showAddedNotification(itemToAdd.name);
        }
    }
});

function showAddedNotification(itemName) {
    const notification = document.createElement('div');
    notification.className = 'added-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${itemName} agregado al pedido</span>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

function updateOrderSummary() {
    orderItemsContainer.innerHTML = '';
    total = 0;

    if (order.length === 0) {
        orderItemsContainer.innerHTML = '<p class="empty-order">Tu pedido está vacío</p>';
        totalPriceElement.textContent = formatPrice(0);
        updateSendButton();
        return;
    }

    order.forEach((item, index) => {
        const orderItemDiv = document.createElement('div');
        orderItemDiv.classList.add('order-item');
        orderItemDiv.setAttribute('data-index', index);

        const customInfo = item.custom ?
            `<small class="custom-info">Personalizada: ${item.ingredients.join(', ')}</small>` : '';

        orderItemDiv.innerHTML = `
            <div class="item-details">
                <span class="item-name">${item.name}</span>
                ${customInfo}
            </div>
            <span class="item-price">${formatPrice(item.price)}</span>
            <button class="remove-item-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
        `;
        orderItemsContainer.appendChild(orderItemDiv);
        total += item.price;
    });

    totalPriceElement.textContent = formatPrice(total);
    updateSendButton();
}

function updateSendButton() {
    const sendOrderBtn = document.getElementById('send-order-btn');
    if (sendOrderBtn) {
        if (order.length === 0) {
            sendOrderBtn.disabled = true;
            sendOrderBtn.style.opacity = '0.5';
            sendOrderBtn.style.cursor = 'not-allowed';
        } else {
            sendOrderBtn.disabled = false;
            sendOrderBtn.style.opacity = '1';
            sendOrderBtn.style.cursor = 'pointer';
        }
    }
}

orderItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item-btn') || e.target.closest('.remove-item-btn')) {
        const btn = e.target.closest('.remove-item-btn');
        const itemIndex = parseInt(btn.getAttribute('data-index'));

        order.splice(itemIndex, 1);
        updateOrderSummary();
    }
});

function generateWhatsAppMessage() {
    if (order.length === 0) {
        alert('Por favor, agrega al menos un producto a tu pedido.');
        return;
    }

    let message = '🍔 *PEDIDO SABOR URBANO* 🍔\n\n';
    message += '📋 *Detalles del pedido:*\n';

    const groupedOrder = {};
    order.forEach(item => {
        const key = item.custom ? `${item.name} (${item.ingredients.join(', ')})` : item.name;
        if (groupedOrder[key]) {
            groupedOrder[key].quantity += 1;
            groupedOrder[key].totalPrice += item.price;
        } else {
            groupedOrder[key] = {
                quantity: 1,
                price: item.price,
                totalPrice: item.price
            };
        }
    });

    Object.keys(groupedOrder).forEach(itemName => {
        const item = groupedOrder[itemName];
        message += `• ${item.quantity}x ${itemName}\n`;
        message += `  ${formatPrice(item.price)} c/u = ${formatPrice(item.totalPrice)}\n\n`;
    });

    message += `💰 *TOTAL: ${formatPrice(total)}*\n\n`;
    message += '📍 *Dirección de entrega:* _Por favor proporcionar_\n';
    message += '📞 *Teléfono de contacto:* _Por favor proporcionar_\n\n';
    message += '¡Gracias por elegir Sabor Urbano! 🙌';

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '573245022369';
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');
}

function sendOrder() {
    generateWhatsAppMessage();
}

window.openBurgerModal = openBurgerModal;
window.closeBurgerModal = closeBurgerModal;
window.toggleIngredient = toggleIngredient;
window.resetCustomBurger = resetCustomBurger;
window.addCustomBurger = addCustomBurger;

document.addEventListener('DOMContentLoaded', () => {
    renderMenuItems(menuItems);

    const sendOrderBtn = document.getElementById('send-order-btn');
    if (sendOrderBtn) {
        sendOrderBtn.addEventListener('click', sendOrder);
    }

    const modal = document.getElementById('burger-modal');
    if (modal) {
        // Asegurar que el modal esté oculto al cargar la página
        modal.style.display = 'none';

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeBurgerModal();
            }
        });
    }
});
