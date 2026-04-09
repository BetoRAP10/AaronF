const app = {
    state: {
        currentPanel: 'restaurantes',
        cart: [],
        selectedRestaurant: null
    },

    data: {
        restaurantes: [
            { id: 'r1', nombre: 'Pizzería Napoli', cat: 'pizza', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500' },
            { id: 'r2', nombre: 'Sushi Roll', cat: 'asiatica', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500' },
            { id: 'r3', nombre: 'Burger Norte', cat: 'hamburguesas', img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500' }
        ],
        menu: {
            r1: [{id: 'p1', nombre: 'Pizza Margarita', precio: 12.00}, {id: 'p2', nombre: 'Pizza Pepperoni', precio: 14.50}],
            r2: [{id: 'p3', nombre: 'Combo Sushi 12pcs', precio: 18.00}],
            r3: [{id: 'p4', nombre: 'Burger Clásica', precio: 10.50}]
        }
    },

    init() {
        this.renderRestaurantes();
        this.bindEvents();
    },

    bindEvents() {
        document.getElementById('cart-toggle').onclick = () => this.toggleSidebar(true);
        document.getElementById('close-sidebar').onclick = () => this.toggleSidebar(false);
        
        // Filtros por categoría
        document.querySelectorAll('.pill').forEach(btn => {
            btn.onclick = (e) => {
                document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
                e.target.classList.add('active');
                this.renderRestaurantes(e.target.dataset.cat);
            };
        });
    },

    showPanel(id) {
        document.querySelectorAll('.panel').forEach(p => p.hidden = true);
        const target = document.getElementById(`panel-${id}`);
        target.hidden = false;
        
        // Actualizar Stepper
        const stepMap = { 'restaurantes': 1, 'menu': 2, 'checkout': 3 };
        document.querySelectorAll('.step').forEach(s => {
            s.classList.toggle('active', parseInt(s.dataset.step) <= stepMap[id]);
        });
        
        this.toggleSidebar(false);
        window.scrollTo(0,0);
    },

    renderRestaurantes(filter = 'todas') {
        const grid = document.getElementById('grid-restaurantes');
        const list = filter === 'todas' ? this.data.restaurantes : this.data.restaurantes.filter(r => r.cat === filter);
        
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
        this.state.selectedRestaurant = res;
        document.getElementById('current-res-name').textContent = res.nombre;
        
        const grid = document.getElementById('grid-platos');
        grid.innerHTML = (this.data.menu[id] || []).map(p => `
            <div class="card" style="cursor: default">
                <div class="card-content">
                    <h4>${p.nombre}</h4>
                    <p style="color:var(--primary); font-weight:800; margin: 10px 0;">${p.precio.toFixed(2)} €</p>
                    <button class="btn-action" onclick="app.addToCart('${p.nombre}', ${p.precio})">Añadir al carrito</button>
                </div>
            </div>
        `).join('');

        this.showPanel('menu');
    },

    addToCart(nombre, precio) {
        this.state.cart.push({ nombre, precio });
        this.updateUI();
        
        // Retroalimentación visual: Agitar el icono del carrito
        const btn = document.getElementById('cart-toggle');
        btn.classList.add('shake-cart');
        setTimeout(() => btn.classList.remove('shake-cart'), 400);
    },

    updateUI() {
        const count = this.state.cart.length;
        document.getElementById('cart-badge').textContent = count;
        
        const total = this.state.cart.reduce((s, i) => s + i.precio, 0);
        document.getElementById('sidebar-total').textContent = `${total.toFixed(2)} €`;
        document.getElementById('final-price').textContent = `${total.toFixed(2)} €`;

        const sidebarList = document.getElementById('sidebar-items');
        sidebarList.innerHTML = this.state.cart.map((item, idx) => `
            <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #334155; padding-bottom:8px;">
                <span>${item.nombre}</span>
                <strong>${item.precio.toFixed(2)}€</strong>
            </div>
        `).join('');

        const checkoutList = document.getElementById('checkout-list');
        if(checkoutList) checkoutList.innerHTML = sidebarList.innerHTML;
    },

    toggleSidebar(open) {
        document.getElementById('sidebar').classList.toggle('active', open);
    },
    // ... (Mantener el objeto app y añadir/modificar estos métodos) ...

    completeOrder() {
        // Aquí podríamos disparar un evento de Clarity personalizado
        if(window.clarity) {
            window.clarity("event", "pedido_completado");
        }
        this.showPanel('exito');
    },

    resetToHome() {
        // Limpiar estado para una nueva compra
        this.state.cart = [];
        this.state.selectedRestaurant = null;
        this.updateUI();
        this.showPanel('restaurantes');
    },

    showPanel(id) {
        document.querySelectorAll('.panel').forEach(p => p.hidden = true);
        const target = document.getElementById(`panel-${id}`);
        if(target) target.hidden = false;
        
        // El stepper solo se muestra en los primeros 3 pasos
        const stepMap = { 'restaurantes': 1, 'menu': 2, 'checkout': 3, 'exito': 3 };
        document.querySelectorAll('.step').forEach(s => {
            const stepNum = parseInt(s.dataset.step);
            s.classList.toggle('active', stepNum <= stepMap[id]);
        });
        
        this.toggleSidebar(false);
        window.scrollTo(0,0);
    },

// ... (El resto de funciones permanecen igual para mantener la lógica de añadir al carrito) ...
    
};



app.init();
