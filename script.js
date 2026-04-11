const app = {
    state: {
        currentPanel: 'restaurantes',
        cart: [],
        selectedRestaurant: null,
        customerData: null
    },

    data: {
        restaurantes: [
            { id: 'r1', nombre: 'Pizzería Napoli', cat: 'pizza', img: './assets/rest-r1.svg' },
            { id: 'r2', nombre: 'Sushi Roll', cat: 'asiatica', img: './assets/rest-r2.svg' },
            { id: 'r3', nombre: 'Burger Norte', cat: 'hamburguesas', img: './assets/rest-r3.svg' },
            { id: 'r4', nombre: 'Mamma Mia Express', cat: 'pizza', img: './assets/rest-r4.svg' }
        ],
        menu: {
            r1: [
                {id: 'p1', nombre: 'Pizza Margarita', precio: 12.00, img: './assets/dish-m1.svg'}, 
                {id: 'p2', nombre: 'Pizza Pepperoni', precio: 14.50, img: './assets/dish-m2.svg'}
            ],
            r2: [
                {id: 'p3', nombre: 'Combo Sushi 12pcs', precio: 18.00, img: './assets/dish-m3.svg'},
                {id: 'p4', nombre: 'Temaki Especial', precio: 9.50, img: './assets/dish-m4.svg'}
            ],
            r3: [
                {id: 'p5', nombre: 'Burger Clásica', precio: 10.50, img: './assets/dish-m5.svg'},
                {id: 'p6', nombre: 'Burger Doble Queso', precio: 13.00, img: './assets/dish-m6.svg'}
            ],
            r4: [
                {id: 'p7', nombre: 'Lasagna Bolognesa', precio: 11.00, img: './assets/dish-m7.svg'},
                {id: 'p8', nombre: 'Focaccia Romana', precio: 6.50, img: './assets/dish-m8.svg'}
            ]
        }
    },

    init() {
        this.renderRestaurantes();
        this.bindEvents();
        this.injectCustomerForm();
    },

    bindEvents() {
        const cartToggle = document.getElementById('cart-toggle');
        const closeSidebar = document.getElementById('close-sidebar');
        
        if(cartToggle) cartToggle.onclick = () => this.toggleSidebar(true);
        if(closeSidebar) closeSidebar.onclick = () => this.toggleSidebar(false);
        
        document.querySelectorAll('.pill').forEach(btn => {
            btn.onclick = (e) => {
                document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
                e.target.classList.add('active');
                this.renderRestaurantes(e.target.dataset.cat);
            };
        });
    },

    // FIX 3: Inject a customer data form into the checkout panel
    injectCustomerForm() {
        const checkoutCard = document.querySelector('#panel-checkout .checkout-card');
        if (!checkoutCard) return;

        const form = document.createElement('div');
        form.id = 'customer-form';
        form.innerHTML = `
            <h4 style="margin: 0 0 12px; font-size: 15px; font-weight: 600;">Datos de entrega</h4>
            <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
                <input id="cf-nombre" type="text" placeholder="Nombre completo" style="padding:10px 14px; border-radius:10px; border:1.5px solid var(--border, #e5e7eb); font-size:14px; font-family:inherit; outline:none; transition:border-color .2s;" onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border, #e5e7eb)'">
                <input id="cf-direccion" type="text" placeholder="Dirección de entrega" style="padding:10px 14px; border-radius:10px; border:1.5px solid var(--border, #e5e7eb); font-size:14px; font-family:inherit; outline:none; transition:border-color .2s;" onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border, #e5e7eb)'">
                <input id="cf-telefono" type="tel" placeholder="Teléfono" style="padding:10px 14px; border-radius:10px; border:1.5px solid var(--border, #e5e7eb); font-size:14px; font-family:inherit; outline:none; transition:border-color .2s;" onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border, #e5e7eb)'">
                <input id="cf-email" type="email" placeholder="Correo electrónico" style="padding:10px 14px; border-radius:10px; border:1.5px solid var(--border, #e5e7eb); font-size:14px; font-family:inherit; outline:none; transition:border-color .2s;" onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border, #e5e7eb)'">
                <div id="cf-error" style="display:none; color:#e53e3e; font-size:13px; font-weight:500;"></div>
            </div>
            <div style="border-top:1px solid var(--border, #e5e7eb); margin-bottom:16px;"></div>
        `;

        // Insert before the order summary heading
        const heading = checkoutCard.querySelector('h3');
        checkoutCard.insertBefore(form, heading.nextSibling);
    },

    showPanel(id) {
        document.querySelectorAll('.panel').forEach(p => p.hidden = true);
        const target = document.getElementById(`panel-${id}`);
        if(target) target.hidden = false;
        
        const stepMap = { 'restaurantes': 1, 'menu': 2, 'checkout': 3, 'exito': 3 };
        document.querySelectorAll('.step').forEach(s => {
            const stepNum = parseInt(s.dataset.step);
            s.classList.toggle('active', stepNum <= stepMap[id]);
        });
        
        this.toggleSidebar(false);
        window.scrollTo(0,0);
    },

    renderRestaurantes(filter = 'todas') {
        const grid = document.getElementById('grid-restaurantes');
        if(!grid) return;

        const list = filter === 'todas' ? this.data.restaurantes : this.data.restaurantes.filter(r => r.cat === filter);

        // FIX 2: Show a clear message if no restaurants match the filter
        if (list.length === 0) {
            grid.innerHTML = `
                <div style="grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--text-muted);">
                    <div style="font-size:40px; margin-bottom:12px;">🍽️</div>
                    <p style="font-size:16px; font-weight:500;">No hay restaurantes en esta categoría por ahora.</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = list.map(r => `
            <div class="card" onclick="app.openMenu('${r.id}')">
                <img src="${r.img}" class="card-img" alt="${r.nombre}">
                <div class="card-content">
                    <h3>${r.nombre}</h3>
                    <p style="color:var(--text-muted)">${r.cat.toUpperCase()}</p>
                </div>
            </div>
        `).join('');
    },

    openMenu(id) {
        const res = this.data.restaurantes.find(r => r.id === id);
        if(!res) return;

        this.state.selectedRestaurant = res;
        document.getElementById('current-res-name').textContent = res.nombre;
        
        const grid = document.getElementById('grid-platos');
        if(grid) {
            const platos = this.data.menu[id] || [];

            // FIX 2: Show a clear message if the restaurant has no dishes
            if (platos.length === 0) {
                grid.innerHTML = `
                    <div style="grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--text-muted);">
                        <div style="font-size:40px; margin-bottom:12px;">🚧</div>
                        <p style="font-size:16px; font-weight:500;">Este restaurante aún no tiene platos disponibles.</p>
                    </div>
                `;
            } else {
                grid.innerHTML = platos.map(p => `
                    <div class="card" style="cursor: default">
                        <img src="${p.img}" class="card-img" style="height:120px; object-fit:contain; padding:10px;">
                        <div class="card-content">
                            <h4>${p.nombre}</h4>
                            <p style="color:var(--primary); font-weight:800; margin: 10px 0;">${p.precio.toFixed(2)} €</p>
                            <button class="btn-action" onclick="app.addToCart('${p.nombre}', ${p.precio})">Añadir al carrito</button>
                        </div>
                    </div>
                `).join('');
            }
        }

        this.showPanel('menu');
    },

    addToCart(nombre, precio) {
        this.state.cart.push({ nombre, precio });
        this.updateUI();
        
        const btn = document.getElementById('cart-toggle');
        if(btn) {
            btn.classList.add('shake-cart');
            setTimeout(() => btn.classList.remove('shake-cart'), 400);
        }
    },

    updateUI() {
        const count = this.state.cart.length;
        const badge = document.getElementById('cart-badge');
        if(badge) badge.textContent = count;
        
        const total = this.state.cart.reduce((s, i) => s + i.precio, 0);
        
        const sidebarTotal = document.getElementById('sidebar-total');
        if(sidebarTotal) sidebarTotal.textContent = `${total.toFixed(2)} €`;

        const finalPrice = document.getElementById('final-price');
        if(finalPrice) finalPrice.textContent = `${total.toFixed(2)} €`;

        const sidebarList = document.getElementById('sidebar-items');
        if(sidebarList) {
            sidebarList.innerHTML = this.state.cart.map((item) => `
                <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px;">
                    <span>${item.nombre}</span>
                    <strong>${item.precio.toFixed(2)}€</strong>
                </div>
            `).join('');
        }

        const checkoutList = document.getElementById('checkout-list');
        if(checkoutList && sidebarList) checkoutList.innerHTML = sidebarList.innerHTML;

        // FIX 1: Disable the pay button when the cart is empty
        const btnPay = document.getElementById('btn-pay');
        if(btnPay) {
            btnPay.disabled = count === 0;
            btnPay.style.opacity = count === 0 ? '0.45' : '1';
            btnPay.style.cursor = count === 0 ? 'not-allowed' : 'pointer';
        }
    },

    toggleSidebar(open) {
        const sidebar = document.getElementById('sidebar');
        if(sidebar) sidebar.classList.toggle('active', open);
    },

    completeOrder() {
        // FIX 1: Guard against empty cart (button is disabled but double-check)
        if(this.state.cart.length === 0) {
            this._showCheckoutError('Agrega al menos un producto antes de continuar.');
            return;
        }

        // FIX 3: Validate customer form fields
        const nombre    = document.getElementById('cf-nombre')?.value.trim();
        const direccion = document.getElementById('cf-direccion')?.value.trim();
        const telefono  = document.getElementById('cf-telefono')?.value.trim();
        const email     = document.getElementById('cf-email')?.value.trim();

        if (!nombre || !direccion || !telefono || !email) {
            this._showCheckoutError('Por favor completa todos los datos de entrega.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this._showCheckoutError('Ingresa un correo electrónico válido.');
            return;
        }

        this._showCheckoutError(''); // clear any previous error

        this.state.customerData = { nombre, direccion, telefono, email };

        if(window.clarity) window.clarity("event", "pedido_completado");
        this.showPanel('exito');
    },

    _showCheckoutError(msg) {
        const el = document.getElementById('cf-error');
        if (!el) return;
        if (msg) {
            el.textContent = msg;
            el.style.display = 'block';
        } else {
            el.style.display = 'none';
        }
    },

    resetToHome() {
        this.state.cart = [];
        this.state.selectedRestaurant = null;
        this.state.customerData = null;

        // Clear the customer form
        ['cf-nombre','cf-direccion','cf-telefono','cf-email'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.value = '';
        });
        this._showCheckoutError('');

        this.updateUI();
        this.showPanel('restaurantes');
    }
};

app.init();
