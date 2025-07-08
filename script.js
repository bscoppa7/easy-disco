// Easy Disco - Gestionale per Discoteche
// Script principale per la gestione della piantina interattiva moderna

document.addEventListener('DOMContentLoaded', function() {
    const zones = document.querySelectorAll('.zone');
    const tooltip = document.getElementById('tooltip');
    const tooltipZone = document.getElementById('tooltip-zone');
    const tooltipOccupancy = document.getElementById('tooltip-occupancy');
    const tooltipBar = document.getElementById('tooltip-bar');
    const tooltipIcon = document.querySelector('.tooltip-icon');

    // Elementi per le statistiche nella navbar
    const totalCapacityEl = document.getElementById('total-capacity');
    const currentOccupancyEl = document.getElementById('current-occupancy');
    const occupancyPercentageEl = document.getElementById('occupancy-percentage');

    // Elementi per il toggle del tema
    const themeToggle = document.getElementById('theme-toggle-input');
    const body = document.body;

    // Elementi per la navigazione
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    // Elementi per le info rapide
    const lastUpdateEl = document.getElementById('last-update');
    const busiestZoneEl = document.getElementById('busiest-zone');
    const freestZoneEl = document.getElementById('freest-zone');

    // Dati delle zone con icone
    const zoneData = {
        'dj': {
            name: 'DJ Booth',
            occupied: 1,
            total: 1,
            icon: 'fas fa-headphones',
            description: 'Postazione del DJ principale'
        },
        'bar-main': {
            name: 'Zona Console',
            occupied: 8,
            total: 15,
            icon: 'fas fa-cocktail',
            description: 'Area console e controlli tecnici'
        },
        'bar-secondary': {
            name: 'Backstage',
            occupied: 3,
            total: 8,
            icon: 'fas fa-wine-glass',
            description: 'Area backstage per artisti e staff'
        },
        'dance-floor': {
            name: 'Pista da Ballo',
            occupied: 45,
            total: 80,
            icon: 'fas fa-music',
            description: 'Area centrale per il ballo'
        },
        'vip': {
            name: 'Area VIP',
            occupied: 12,
            total: 20,
            icon: 'fas fa-crown',
            description: 'Area riservata VIP con servizio esclusivo'
        },
        'tables': {
            name: 'Zona Tavoli',
            occupied: 24,
            total: 40,
            icon: 'fas fa-chair',
            description: 'Tavoli per gruppi e cene'
        },
        'lounge': {
            name: 'Zona Lounge',
            occupied: 15,
            total: 25,
            icon: 'fas fa-couch',
            description: 'Area relax e conversazione'
        },
        'smoking': {
            name: 'Zona Fumatori',
            occupied: 6,
            total: 15,
            icon: 'fas fa-smoking',
            description: 'Area dedicata ai fumatori'
        },
        'entrance': {
            name: 'Ingresso',
            occupied: 0,
            total: 0,
            icon: 'fas fa-door-open',
            description: 'Ingresso principale della discoteca'
        },
        'restrooms': {
            name: 'WC',
            occupied: 4,
            total: 8,
            icon: 'fas fa-restroom',
            description: 'Servizi igienici'
        }
    };

    // Funzione per calcolare la percentuale di occupazione
    function getOccupancyPercentage(occupied, total) {
        if (total === 0) return 0;
        return Math.round((occupied / total) * 100);
    }

    // Funzione per ottenere il colore in base alla percentuale di occupazione
    function getOccupancyColor(percentage) {
        if (percentage >= 71) return '#ef4444'; // Rosso - pieno
        if (percentage >= 31) return '#f59e0b'; // Arancione - moderato
        return '#10b981'; // Verde - libero
    }

    // Funzione per aggiornare il colore della zona in base all'occupazione
    function updateZoneColor(zone, zoneId) {
        const data = zoneData[zoneId];
        if (data && data.total > 0) {
            const percentage = getOccupancyPercentage(data.occupied, data.total);
            const color = getOccupancyColor(percentage);

            // Aggiorna il bordo della zona con il colore dell'occupazione
            zone.style.borderColor = color;
            zone.style.borderWidth = '3px';

            // Aggiunge un glow effect per zone molto occupate
            if (percentage >= 90) {
                zone.style.boxShadow = `0 0 20px ${color}40`;
            } else {
                zone.style.boxShadow = '';
            }
        }
    }

    // Funzione per aggiornare le statistiche nella navbar
    function updateNavbarStats() {
        let totalCapacity = 0;
        let currentOccupancy = 0;

        Object.values(zoneData).forEach(zone => {
            if (zone.total > 0) {
                totalCapacity += zone.total;
                currentOccupancy += zone.occupied;
            }
        });

        const overallPercentage = totalCapacity > 0 ?
            Math.round((currentOccupancy / totalCapacity) * 100) : 0;

        // Aggiorna gli elementi della navbar con animazione
        animateNumber(totalCapacityEl, totalCapacity);
        animateNumber(currentOccupancyEl, currentOccupancy);
        occupancyPercentageEl.textContent = `${overallPercentage}%`;

        // Cambia colore in base alla percentuale
        const color = getOccupancyColor(overallPercentage);
        occupancyPercentageEl.style.color = color;

        // Aggiorna le info rapide nella sidebar
        updateQuickInfo();
    }

    // Funzione per aggiornare le info rapide
    function updateQuickInfo() {
        // Aggiorna timestamp
        const now = new Date();
        const timeString = now.toLocaleTimeString('it-IT', {
            hour: '2-digit',
            minute: '2-digit'
        });
        if (lastUpdateEl) lastUpdateEl.textContent = timeString;

        // Trova zona più affollata e più libera (escludendo zone di servizio)
        let busiestZone = null;
        let freestZone = null;
        let maxPercentage = -1;
        let minPercentage = 101;

        // Zone di servizio da escludere dal calcolo
        const serviceZones = ['dj', 'entrance', 'restrooms'];

        Object.entries(zoneData).forEach(([zoneId, data]) => {
            if (data.total > 0 && !serviceZones.includes(zoneId)) {
                const percentage = getOccupancyPercentage(data.occupied, data.total);

                if (percentage > maxPercentage) {
                    maxPercentage = percentage;
                    busiestZone = data.name;
                }

                if (percentage < minPercentage) {
                    minPercentage = percentage;
                    freestZone = data.name;
                }
            }
        });

        if (busiestZoneEl) {
            busiestZoneEl.textContent = busiestZone ? `${busiestZone} (${maxPercentage}%)` : '--';
        }

        if (freestZoneEl) {
            freestZoneEl.textContent = freestZone ? `${freestZone} (${minPercentage}%)` : '--';
        }
    }

    // Funzione per animare i numeri
    function animateNumber(element, targetValue) {
        const currentValue = parseInt(element.textContent) || 0;
        const increment = targetValue > currentValue ? 1 : -1;
        const duration = 500;
        const steps = Math.abs(targetValue - currentValue);
        const stepDuration = steps > 0 ? duration / steps : 0;

        if (steps === 0) return;

        let current = currentValue;
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current;

            if (current === targetValue) {
                clearInterval(timer);
            }
        }, stepDuration);
    }

    // Inizializza i colori delle zone e le statistiche (solo per zone interattive)
    zones.forEach(zone => {
        const zoneId = zone.dataset.zone;
        // Aggiorna colori solo per zone interattive
        if (!zone.classList.contains('no-hover')) {
            updateZoneColor(zone, zoneId);
        }
    });

    updateNavbarStats();

    // ===== GESTIONE TEMA =====

    // Funzione per applicare il tema
    function applyTheme(theme) {
        if (theme === 'light') {
            body.setAttribute('data-theme', 'light');
            themeToggle.checked = false;
        } else {
            body.setAttribute('data-theme', 'dark');
            themeToggle.checked = true;
        }

        // Salva la preferenza nel localStorage
        localStorage.setItem('easy-disco-theme', theme);

        // Aggiorna i colori delle zone per il nuovo tema
        zones.forEach(zone => {
            const zoneId = zone.dataset.zone;
            updateZoneColor(zone, zoneId);
        });

        console.log(`🎨 Tema cambiato a: ${theme}`);
    }

    // Funzione per ottenere il tema salvato o quello di sistema
    function getPreferredTheme() {
        const savedTheme = localStorage.getItem('easy-disco-theme');
        if (savedTheme) {
            return savedTheme;
        }

        // Controlla la preferenza di sistema
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }

        return 'dark'; // Default
    }

    // Funzione per toggle del tema
    function toggleTheme() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);

        // Mostra notifica del cambio tema
        const themeIcon = newTheme === 'light' ? '☀️' : '🌙';
        const themeName = newTheme === 'light' ? 'Giorno' : 'Notte';
        showNotification(`${themeIcon} Modalità ${themeName} attivata`, 'info');
    }

    // Event listener per il toggle del tema
    themeToggle.addEventListener('change', toggleTheme);

    // Listener per i cambiamenti di preferenza di sistema
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
            if (!localStorage.getItem('easy-disco-theme')) {
                applyTheme(e.matches ? 'light' : 'dark');
            }
        });
    }

    // Applica il tema iniziale
    const initialTheme = getPreferredTheme();
    applyTheme(initialTheme);

    // ===== GESTIONE NAVIGAZIONE TAB =====

    // Funzione per cambiare sezione
    function switchSection(targetSection) {
        // Rimuovi classe active da tutti i nav items e contenuti
        navItems.forEach(item => item.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));

        // Aggiungi classe active al nav item e contenuto selezionato
        const activeNavItem = document.querySelector(`[data-tab="${targetSection}"]`);
        const activeContent = document.getElementById(`${targetSection}-content`);

        if (activeNavItem && activeContent) {
            activeNavItem.classList.add('active');
            activeContent.classList.add('active');

            // Salva la sezione attiva nel localStorage
            localStorage.setItem('easy-disco-active-section', targetSection);

            // Aggiorna le statistiche se siamo nella home
            if (targetSection === 'home') {
                updateNavbarStats();
            }

            // Gestisci la visibilità della leggenda e il layout
            const sidebarRight = document.querySelector('.sidebar-right');
            const dashboardLayout = document.querySelector('.dashboard-layout');

            if (sidebarRight && dashboardLayout) {
                if (targetSection === 'home') {
                    sidebarRight.style.display = 'block';
                    dashboardLayout.classList.remove('no-legend');
                } else {
                    sidebarRight.style.display = 'none';
                    dashboardLayout.classList.add('no-legend');
                }
            }

            // Inizializza la cambusa se siamo in quella sezione
            if (targetSection === 'cambusa') {
                setTimeout(() => {
                    initCambusa();
                }, 100);
            }

            // Inizializza la gestione PR se siamo in quella sezione
            if (targetSection === 'pr') {
                setTimeout(() => {
                    initPr();
                }, 100);
            }

            // Inizializza Entrate & Uscite se siamo in quella sezione
            if (targetSection === 'entrate-uscite') {
                setTimeout(() => {
                    initFinance();
                }, 100);
            }

            // Inizializza Calendario se siamo in quella sezione
            if (targetSection === 'calendario') {
                setTimeout(() => {
                    initCalendar();
                }, 100);
            }

            // Inizializza Rubrica se siamo in quella sezione
            if (targetSection === 'rubrica') {
                setTimeout(() => {
                    initContacts();
                }, 100);
            }

            // Inizializza Statistiche se siamo in quella sezione
            if (targetSection === 'statistiche') {
                setTimeout(() => {
                    initStatistics();
                }, 100);
            }

            console.log(`📄 Sezione cambiata a: ${targetSection}`);

            // Tutte le sezioni sono ora implementate
            if (targetSection !== 'home') {
                const sectionName = activeNavItem.querySelector('span')?.textContent || targetSection;
                showNotification(`📄 Sezione "${sectionName}" caricata`, 'success');
            }
        }
    }

    // Funzione per ottenere la sezione salvata o default
    function getActiveSection() {
        return localStorage.getItem('easy-disco-active-section') || 'home';
    }

    // Event listeners per i nav items
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.getAttribute('data-tab');
            switchSection(targetSection);
        });

        // Effetto hover con feedback tattile
        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('active')) {
                item.style.transform = 'translateX(4px)';
            }
        });

        item.addEventListener('mouseleave', () => {
            if (!item.classList.contains('active')) {
                item.style.transform = '';
            }
        });
    });

    // Inizializza la sezione attiva
    const initialSection = getActiveSection();
    switchSection(initialSection);

    // ===== GESTIONE CAMBUSA =====

    // Dati prodotti cambusa (simulati - in produzione verrebbero da database)
    const cambusaData = [
        {
            id: 1,
            name: 'Vodka Premium',
            category: 'spirits',
            quantity: 12,
            price: 25.00,
            minStock: 5,
            supplier: 'Fornitore A'
        },
        {
            id: 2,
            name: 'Whisky Single Malt',
            category: 'spirits',
            quantity: 8,
            price: 45.00,
            minStock: 3,
            supplier: 'Fornitore B'
        },
        {
            id: 3,
            name: 'Gin Artigianale',
            category: 'spirits',
            quantity: 15,
            price: 35.00,
            minStock: 5,
            supplier: 'Fornitore A'
        },
        {
            id: 4,
            name: 'Coca Cola (24 lattine)',
            category: 'beverages',
            quantity: 25,
            price: 12.00,
            minStock: 10,
            supplier: 'Fornitore C'
        },
        {
            id: 5,
            name: 'Acqua Naturale (24 bottiglie)',
            category: 'beverages',
            quantity: 30,
            price: 8.00,
            minStock: 15,
            supplier: 'Fornitore C'
        },
        {
            id: 6,
            name: 'Red Bull (24 lattine)',
            category: 'beverages',
            quantity: 18,
            price: 28.00,
            minStock: 8,
            supplier: 'Fornitore C'
        },
        {
            id: 7,
            name: 'Patatine Assortite',
            category: 'snacks',
            quantity: 40,
            price: 2.50,
            minStock: 20,
            supplier: 'Fornitore D'
        },
        {
            id: 8,
            name: 'Noccioline',
            category: 'snacks',
            quantity: 35,
            price: 3.00,
            minStock: 15,
            supplier: 'Fornitore D'
        },
        {
            id: 9,
            name: 'Bicchieri Plastica (100pz)',
            category: 'supplies',
            quantity: 5,
            price: 15.00,
            minStock: 10,
            supplier: 'Fornitore E'
        },
        {
            id: 10,
            name: 'Cannucce (500pz)',
            category: 'supplies',
            quantity: 8,
            price: 12.00,
            minStock: 5,
            supplier: 'Fornitore E'
        }
    ];

    let currentCategory = 'all';
    let filteredProducts = [...cambusaData];

    // Funzioni per la gestione della cambusa
    function updateCambusaStats() {
        const totalProducts = cambusaData.length;
        const lowStock = cambusaData.filter(p => p.quantity <= p.minStock).length;
        const totalValue = cambusaData.reduce((sum, p) => sum + (p.quantity * p.price), 0);
        const pendingOrders = Math.floor(Math.random() * 5) + 1; // Simulato

        document.getElementById('total-products').textContent = totalProducts;
        document.getElementById('low-stock').textContent = lowStock;
        document.getElementById('total-value').textContent = `€${totalValue.toFixed(2)}`;
        document.getElementById('pending-orders').textContent = pendingOrders;
    }

    function getStockStatus(product) {
        if (product.quantity === 0) return 'out';
        if (product.quantity <= product.minStock) return 'low';
        return 'ok';
    }

    function getStockStatusText(status) {
        switch (status) {
            case 'out': return 'Esaurito';
            case 'low': return 'Scorta Bassa';
            case 'ok': return 'Disponibile';
            default: return 'Sconosciuto';
        }
    }

    function getCategoryName(category) {
        const categories = {
            'spirits': 'Alcolici',
            'beverages': 'Bevande',
            'snacks': 'Snack',
            'supplies': 'Forniture'
        };
        return categories[category] || category;
    }

    function renderProductsTable() {
        const tbody = document.getElementById('products-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        filteredProducts.forEach(product => {
            const stockStatus = getStockStatus(product);
            const totalValue = (product.quantity * product.price).toFixed(2);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="product-name">${product.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 0.25rem;">
                        ${product.supplier}
                    </div>
                </td>
                <td>
                    <span class="category-badge category-${product.category}">
                        ${getCategoryName(product.category)}
                    </span>
                </td>
                <td>
                    <strong>${product.quantity}</strong>
                    <span style="color: var(--text-tertiary); font-size: 0.75rem;">
                        (min: ${product.minStock})
                    </span>
                </td>
                <td>€${product.price.toFixed(2)}</td>
                <td>€${totalValue}</td>
                <td>
                    <span class="stock-status stock-${stockStatus}">
                        ${getStockStatusText(stockStatus)}
                    </span>
                </td>
                <td>
                    <button class="action-btn edit" onclick="editProduct(${product.id})" title="Modifica">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteProduct(${product.id})" title="Elimina">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function filterProducts() {
        const searchTerm = document.getElementById('product-search')?.value.toLowerCase() || '';

        filteredProducts = cambusaData.filter(product => {
            const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                                product.supplier.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });

        renderProductsTable();
    }

    // Event listeners per la cambusa
    function initCambusaEvents() {
        // Category tabs
        const categoryTabs = document.querySelectorAll('.category-tab');
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                categoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentCategory = tab.dataset.category;
                filterProducts();
            });
        });

        // Search
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
            searchInput.addEventListener('input', filterProducts);
        }

        // Add product button
        const addBtn = document.getElementById('add-product-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                showNotification('Funzione "Aggiungi Prodotto" in sviluppo', 'info');
            });
        }

        // Export button
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                showNotification('Export inventario in sviluppo', 'info');
            });
        }
    }

    // Funzioni globali per le azioni sui prodotti
    window.editProduct = function(productId) {
        const product = cambusaData.find(p => p.id === productId);
        if (product) {
            showNotification(`Modifica "${product.name}" in sviluppo`, 'info');
        }
    };

    window.deleteProduct = function(productId) {
        const product = cambusaData.find(p => p.id === productId);
        if (product && confirm(`Sei sicuro di voler eliminare "${product.name}"?`)) {
            const index = cambusaData.findIndex(p => p.id === productId);
            cambusaData.splice(index, 1);
            filterProducts();
            updateCambusaStats();
            showNotification(`"${product.name}" eliminato dall'inventario`, 'success');
        }
    };

    // Inizializza la cambusa quando la sezione è attiva
    function initCambusa() {
        updateCambusaStats();
        renderProductsTable();
        initCambusaEvents();
    }

    // ===== GESTIONE PR =====

    // Dati PR (simulati)
    const prData = [
        {
            id: 1,
            name: 'Marco Rossi',
            phone: '+39 333 1234567',
            email: 'marco.rossi@email.com',
            commissionRate: 5.00,
            totalGuests: 45,
            monthlyCommission: 225.00,
            status: 'active'
        },
        {
            id: 2,
            name: 'Sofia Bianchi',
            phone: '+39 334 7654321',
            email: 'sofia.bianchi@email.com',
            commissionRate: 4.50,
            totalGuests: 38,
            monthlyCommission: 171.00,
            status: 'active'
        },
        {
            id: 3,
            name: 'Luca Verdi',
            phone: '+39 335 9876543',
            email: 'luca.verdi@email.com',
            commissionRate: 6.00,
            totalGuests: 52,
            monthlyCommission: 312.00,
            status: 'active'
        },
        {
            id: 4,
            name: 'Giulia Neri',
            phone: '+39 336 5432109',
            email: 'giulia.neri@email.com',
            commissionRate: 4.00,
            totalGuests: 29,
            monthlyCommission: 116.00,
            status: 'inactive'
        }
    ];

    // Dati ospiti (simulati)
    const guestsData = [
        {
            id: 1,
            name: 'Alessandro Costa',
            phone: '+39 340 1111111',
            prId: 1,
            people: 4,
            status: 'confirmed',
            date: '2024-01-15',
            notes: 'Tavolo preferito zona VIP'
        },
        {
            id: 2,
            name: 'Francesca Marino',
            phone: '+39 341 2222222',
            prId: 2,
            people: 2,
            status: 'pending',
            date: '2024-01-15',
            notes: ''
        },
        {
            id: 3,
            name: 'Roberto Ferrari',
            phone: '+39 342 3333333',
            prId: 1,
            people: 6,
            status: 'confirmed',
            date: '2024-01-15',
            notes: 'Compleanno'
        },
        {
            id: 4,
            name: 'Elena Ricci',
            phone: '+39 343 4444444',
            prId: 3,
            people: 3,
            status: 'cancelled',
            date: '2024-01-14',
            notes: 'Cancellato per maltempo'
        },
        {
            id: 5,
            name: 'Matteo Conti',
            phone: '+39 344 5555555',
            prId: 2,
            people: 5,
            status: 'confirmed',
            date: '2024-01-15',
            notes: ''
        }
    ];

    let currentPrSection = 'pr-list';

    // Funzioni per la gestione PR
    function updatePrStats() {
        const activePr = prData.filter(pr => pr.status === 'active').length;
        const totalGuests = guestsData.length;
        const confirmedGuests = guestsData.filter(g => g.status === 'confirmed').length;
        const totalCommissions = prData.reduce((sum, pr) => sum + pr.monthlyCommission, 0);

        document.getElementById('total-pr').textContent = activePr;
        document.getElementById('total-guests').textContent = totalGuests;
        document.getElementById('confirmed-guests').textContent = confirmedGuests;
        document.getElementById('total-commissions').textContent = `€${totalCommissions.toFixed(2)}`;
    }

    function getPrName(prId) {
        const pr = prData.find(p => p.id === prId);
        return pr ? pr.name : 'Sconosciuto';
    }

    function getStatusText(status) {
        const statuses = {
            'confirmed': 'Confermato',
            'pending': 'In Attesa',
            'cancelled': 'Cancellato',
            'paid': 'Pagato',
            'unpaid': 'Non Pagato'
        };
        return statuses[status] || status;
    }

    function renderPrGrid() {
        const prGrid = document.getElementById('pr-grid');
        if (!prGrid) return;

        prGrid.innerHTML = '';

        prData.forEach(pr => {
            const initials = pr.name.split(' ').map(n => n[0]).join('');
            const statusClass = pr.status === 'active' ? 'success' : 'secondary';

            const prCard = document.createElement('div');
            prCard.className = 'pr-card';
            prCard.innerHTML = `
                <div class="pr-card-header">
                    <div class="pr-avatar">${initials}</div>
                    <div class="pr-info">
                        <h4>${pr.name}</h4>
                        <p>${pr.phone}</p>
                    </div>
                </div>
                <div class="pr-stats">
                    <div class="pr-stat">
                        <span class="pr-stat-value">${pr.totalGuests}</span>
                        <span class="pr-stat-label">Ospiti Totali</span>
                    </div>
                    <div class="pr-stat">
                        <span class="pr-stat-value">€${pr.monthlyCommission.toFixed(0)}</span>
                        <span class="pr-stat-label">Commissioni</span>
                    </div>
                </div>
                <div class="pr-actions">
                    <button class="pr-action-btn primary" onclick="viewPrDetails(${pr.id})">
                        <i class="fas fa-eye"></i>
                        Dettagli
                    </button>
                    <button class="pr-action-btn secondary" onclick="editPr(${pr.id})">
                        <i class="fas fa-edit"></i>
                        Modifica
                    </button>
                </div>
            `;
            prGrid.appendChild(prCard);
        });
    }

    function renderGuestsTable() {
        const tbody = document.getElementById('guests-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        guestsData.forEach(guest => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="guest-name">${guest.name}</div>
                    ${guest.notes ? `<div style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 0.25rem;">${guest.notes}</div>` : ''}
                </td>
                <td>${guest.phone}</td>
                <td>${getPrName(guest.prId)}</td>
                <td>${guest.people}</td>
                <td>
                    <span class="status-badge status-${guest.status}">
                        ${getStatusText(guest.status)}
                    </span>
                </td>
                <td>${new Date(guest.date).toLocaleDateString('it-IT')}</td>
                <td>
                    <button class="action-btn edit" onclick="editGuest(${guest.id})" title="Modifica">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteGuest(${guest.id})" title="Elimina">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function renderCommissionsTable() {
        const tbody = document.getElementById('commissions-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        prData.forEach(pr => {
            const guestCount = guestsData.filter(g => g.prId === pr.id && g.status === 'confirmed').length;
            const commission = guestCount * pr.commissionRate;
            const status = commission > 0 ? 'unpaid' : 'paid';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="pr-name">${pr.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 0.25rem;">
                        ${pr.phone}
                    </div>
                </td>
                <td>${guestCount}</td>
                <td>€${pr.commissionRate.toFixed(2)}</td>
                <td><strong>€${commission.toFixed(2)}</strong></td>
                <td>
                    <span class="status-badge status-${status}">
                        ${getStatusText(status)}
                    </span>
                </td>
                <td>
                    <button class="action-btn edit" onclick="payCommission(${pr.id})" title="Segna come Pagato">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="action-btn" onclick="viewCommissionDetails(${pr.id})" title="Dettagli">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function populatePrFilter() {
        const prFilter = document.getElementById('pr-filter');
        if (!prFilter) return;

        // Mantieni l'opzione "Tutti i PR"
        prFilter.innerHTML = '<option value="all">Tutti i PR</option>';

        prData.forEach(pr => {
            const option = document.createElement('option');
            option.value = pr.id;
            option.textContent = pr.name;
            prFilter.appendChild(option);
        });
    }

    function switchPrSection(sectionName) {
        // Rimuovi active da tutti i tab e sezioni
        document.querySelectorAll('.pr-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.pr-section').forEach(section => section.classList.remove('active'));

        // Attiva il tab e la sezione correnti
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        document.getElementById(`${sectionName}-section`).classList.add('active');

        currentPrSection = sectionName;

        // Renderizza il contenuto appropriato
        switch (sectionName) {
            case 'pr-list':
                renderPrGrid();
                break;
            case 'guest-list':
                renderGuestsTable();
                populatePrFilter();
                break;
            case 'commissions':
                renderCommissionsTable();
                break;
        }
    }

    function initPrEvents() {
        // PR section tabs
        document.querySelectorAll('.pr-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const section = tab.dataset.section;
                switchPrSection(section);
            });
        });

        // Add buttons
        const addPrBtn = document.getElementById('add-pr-btn');
        if (addPrBtn) {
            addPrBtn.addEventListener('click', () => {
                showNotification('Funzione "Aggiungi PR" in sviluppo', 'info');
            });
        }

        const addGuestBtn = document.getElementById('add-guest-btn');
        if (addGuestBtn) {
            addGuestBtn.addEventListener('click', () => {
                showNotification('Funzione "Aggiungi Ospite" in sviluppo', 'info');
            });
        }

        // Export button
        const exportCommissionsBtn = document.getElementById('export-commissions-btn');
        if (exportCommissionsBtn) {
            exportCommissionsBtn.addEventListener('click', () => {
                showNotification('Export commissioni in sviluppo', 'info');
            });
        }

        // PR filter
        const prFilter = document.getElementById('pr-filter');
        if (prFilter) {
            prFilter.addEventListener('change', (e) => {
                const selectedPr = e.target.value;
                if (selectedPr === 'all') {
                    renderGuestsTable();
                } else {
                    // Filtra ospiti per PR selezionato
                    const filteredGuests = guestsData.filter(g => g.prId == selectedPr);
                    renderFilteredGuestsTable(filteredGuests);
                }
            });
        }
    }

    function renderFilteredGuestsTable(guests) {
        const tbody = document.getElementById('guests-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        guests.forEach(guest => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="guest-name">${guest.name}</div>
                    ${guest.notes ? `<div style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 0.25rem;">${guest.notes}</div>` : ''}
                </td>
                <td>${guest.phone}</td>
                <td>${getPrName(guest.prId)}</td>
                <td>${guest.people}</td>
                <td>
                    <span class="status-badge status-${guest.status}">
                        ${getStatusText(guest.status)}
                    </span>
                </td>
                <td>${new Date(guest.date).toLocaleDateString('it-IT')}</td>
                <td>
                    <button class="action-btn edit" onclick="editGuest(${guest.id})" title="Modifica">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteGuest(${guest.id})" title="Elimina">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Funzioni globali per le azioni
    window.viewPrDetails = function(prId) {
        const pr = prData.find(p => p.id === prId);
        if (pr) {
            showNotification(`Dettagli "${pr.name}" in sviluppo`, 'info');
        }
    };

    window.editPr = function(prId) {
        const pr = prData.find(p => p.id === prId);
        if (pr) {
            showNotification(`Modifica "${pr.name}" in sviluppo`, 'info');
        }
    };

    window.editGuest = function(guestId) {
        const guest = guestsData.find(g => g.id === guestId);
        if (guest) {
            showNotification(`Modifica ospite "${guest.name}" in sviluppo`, 'info');
        }
    };

    window.deleteGuest = function(guestId) {
        const guest = guestsData.find(g => g.id === guestId);
        if (guest && confirm(`Sei sicuro di voler eliminare "${guest.name}" dalla lista?`)) {
            const index = guestsData.findIndex(g => g.id === guestId);
            guestsData.splice(index, 1);
            renderGuestsTable();
            updatePrStats();
            showNotification(`"${guest.name}" rimosso dalla lista`, 'success');
        }
    };

    window.payCommission = function(prId) {
        const pr = prData.find(p => p.id === prId);
        if (pr) {
            showNotification(`Commissione "${pr.name}" segnata come pagata`, 'success');
        }
    };

    window.viewCommissionDetails = function(prId) {
        const pr = prData.find(p => p.id === prId);
        if (pr) {
            showNotification(`Dettagli commissioni "${pr.name}" in sviluppo`, 'info');
        }
    };

    // Inizializza la sezione PR
    function initPr() {
        updatePrStats();
        switchPrSection('pr-list');
        initPrEvents();
    }

    // ===== GESTIONE ENTRATE & USCITE =====

    // Dati transazioni (simulati)
    const transactionsData = [
        { id: 1, date: '2024-01-15', description: 'Incasso serata', category: 'Vendite', type: 'income', amount: 2500.00 },
        { id: 2, date: '2024-01-15', description: 'Acquisto bevande', category: 'Inventario', type: 'expense', amount: 450.00 },
        { id: 3, date: '2024-01-14', description: 'Stipendi staff', category: 'Personale', type: 'expense', amount: 800.00 },
        { id: 4, date: '2024-01-14', description: 'Incasso eventi privati', category: 'Eventi', type: 'income', amount: 1200.00 },
        { id: 5, date: '2024-01-13', description: 'Manutenzione impianti', category: 'Manutenzione', type: 'expense', amount: 300.00 },
        { id: 6, date: '2024-01-13', description: 'Vendita merchandising', category: 'Vendite', type: 'income', amount: 150.00 },
        { id: 7, date: '2024-01-12', description: 'Bollette utenze', category: 'Utenze', type: 'expense', amount: 250.00 },
        { id: 8, date: '2024-01-12', description: 'Incasso bar', category: 'Vendite', type: 'income', amount: 1800.00 }
    ];

    const categoriesData = [
        { id: 1, name: 'Vendite', type: 'income', color: '#10b981', total: 4450.00 },
        { id: 2, name: 'Eventi', type: 'income', color: '#3b82f6', total: 1200.00 },
        { id: 3, name: 'Inventario', type: 'expense', color: '#f59e0b', total: 450.00 },
        { id: 4, name: 'Personale', type: 'expense', color: '#ef4444', total: 800.00 },
        { id: 5, name: 'Manutenzione', type: 'expense', color: '#8b5cf6', total: 300.00 },
        { id: 6, name: 'Utenze', type: 'expense', color: '#6b7280', total: 250.00 }
    ];

    // ===== GESTIONE CALENDARIO =====

    // Dati eventi (simulati)
    const eventsData = [
        { id: 1, title: 'Serata Latino', date: '2024-01-20', status: 'confirmed', attendees: 150, type: 'special', color: '#e74c3c' },
        { id: 2, title: 'DJ Set Elettronica', date: '2024-01-22', status: 'planned', attendees: 200, type: 'regular', color: '#3498db' },
        { id: 3, title: 'Festa Privata', date: '2024-01-25', status: 'confirmed', attendees: 80, type: 'private', color: '#9b59b6' },
        { id: 4, title: 'Karaoke Night', date: '2024-01-27', status: 'planned', attendees: 120, type: 'regular', color: '#f39c12' },
        { id: 5, title: 'Compleanno VIP', date: '2024-01-30', status: 'confirmed', attendees: 50, type: 'private', color: '#e67e22' },
        { id: 6, title: 'Aperitivo Jazz', date: '2024-02-03', status: 'confirmed', attendees: 90, type: 'special', color: '#27ae60' },
        { id: 7, title: 'Festa Anni 80', date: '2024-02-10', status: 'planned', attendees: 180, type: 'special', color: '#8e44ad' },
        { id: 8, title: 'Serata Salsa', date: '2024-02-14', status: 'confirmed', attendees: 160, type: 'special', color: '#e74c3c' },
        { id: 9, title: 'DJ Battle', date: '2024-02-17', status: 'planned', attendees: 220, type: 'regular', color: '#34495e' },
        { id: 10, title: 'Evento Aziendale', date: '2024-02-24', status: 'confirmed', attendees: 120, type: 'private', color: '#16a085' }
    ];

    // Stato del calendario
    let currentCalendarDate = new Date();
    const today = new Date();

    // Nomi dei mesi e giorni in italiano
    const monthNames = [
        'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];

    const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

    const tasksData = [
        { id: 1, text: 'Preparare playlist serata Latino', completed: false, eventId: 1 },
        { id: 2, text: 'Ordinare decorazioni', completed: true, eventId: 1 },
        { id: 3, text: 'Confermare DJ ospite', completed: false, eventId: 2 },
        { id: 4, text: 'Preparare contratto festa privata', completed: false, eventId: 3 },
        { id: 5, text: 'Testare impianto karaoke', completed: true, eventId: 4 }
    ];

    // ===== GESTIONE RUBRICA =====

    // Dati contatti (simulati)
    const contactsData = [
        { id: 1, name: 'Mario Rossi', phone: '+39 333 1111111', email: 'mario.rossi@email.com', type: 'customer', vip: false, company: '' },
        { id: 2, name: 'Laura Bianchi', phone: '+39 334 2222222', email: 'laura.bianchi@email.com', type: 'customer', vip: true, company: '' },
        { id: 3, name: 'Giuseppe Verdi', phone: '+39 335 3333333', email: 'giuseppe.verdi@email.com', type: 'customer', vip: true, company: '' },
        { id: 4, name: 'Anna Neri', phone: '+39 336 4444444', email: 'anna.neri@email.com', type: 'customer', vip: false, company: '' },
        { id: 5, name: 'Marco Ferrari', phone: '+39 337 5555555', email: 'marco.ferrari@email.com', type: 'customer', vip: false, company: '' }
    ];

    const suppliersData = [
        { id: 1, company: 'Bevande & Co.', contact: 'Luca Martini', category: 'Bevande', phone: '+39 011 1234567', email: 'ordini@bevande.com', status: 'active' },
        { id: 2, company: 'Audio Pro Service', contact: 'Sara Conti', category: 'Attrezzature', phone: '+39 011 2345678', email: 'info@audiopro.com', status: 'active' },
        { id: 3, company: 'Pulizie Express', contact: 'Roberto Galli', category: 'Servizi', phone: '+39 011 3456789', email: 'pulizie@express.com', status: 'active' },
        { id: 4, company: 'Security Plus', contact: 'Andrea Ricci', category: 'Sicurezza', phone: '+39 011 4567890', email: 'security@plus.com', status: 'inactive' }
    ];

    let currentFinanceSection = 'transactions';
    let currentCalendarSection = 'calendar-view';
    let currentContactsSection = 'all-contacts';
    let currentStatisticsSection = 'overview';

    // ===== FUNZIONI ENTRATE & USCITE =====

    function updateFinanceStats() {
        const totalIncome = transactionsData.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactionsData.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const netBalance = totalIncome - totalExpenses;
        const dailyAverage = netBalance / 30; // Assumendo 30 giorni

        document.getElementById('total-income').textContent = `€${totalIncome.toFixed(2)}`;
        document.getElementById('total-expenses').textContent = `€${totalExpenses.toFixed(2)}`;
        document.getElementById('net-balance').textContent = `€${netBalance.toFixed(2)}`;
        document.getElementById('daily-average').textContent = `€${dailyAverage.toFixed(2)}`;
    }

    function renderTransactionsTable() {
        const tbody = document.getElementById('transactions-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        transactionsData.forEach(transaction => {
            const row = document.createElement('tr');
            const amountClass = transaction.type === 'income' ? 'transaction-income' : 'transaction-expense';
            const amountPrefix = transaction.type === 'income' ? '+' : '-';

            row.innerHTML = `
                <td>${new Date(transaction.date).toLocaleDateString('it-IT')}</td>
                <td><strong>${transaction.description}</strong></td>
                <td>${transaction.category}</td>
                <td>
                    <span class="status-badge status-${transaction.type === 'income' ? 'confirmed' : 'pending'}">
                        ${transaction.type === 'income' ? 'Entrata' : 'Uscita'}
                    </span>
                </td>
                <td class="${amountClass}"><strong>${amountPrefix}€${transaction.amount.toFixed(2)}</strong></td>
                <td>
                    <button class="action-btn edit" onclick="editTransaction(${transaction.id})" title="Modifica">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteTransaction(${transaction.id})" title="Elimina">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function renderCategoriesGrid() {
        const grid = document.getElementById('categories-grid');
        if (!grid) return;

        grid.innerHTML = '';
        categoriesData.forEach(category => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <div class="category-card-icon" style="background: ${category.color}">
                    <i class="fas fa-${category.type === 'income' ? 'arrow-up' : 'arrow-down'}"></i>
                </div>
                <h4>${category.name}</h4>
                <p>€${category.total.toFixed(2)}</p>
                <div style="margin-top: 1rem;">
                    <button class="btn btn-secondary" onclick="editCategory(${category.id})">
                        <i class="fas fa-edit"></i>
                        Modifica
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function switchFinanceSection(sectionName) {
        document.querySelectorAll('.finance-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.finance-section').forEach(section => section.classList.remove('active'));

        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        document.getElementById(`${sectionName}-section`).classList.add('active');

        currentFinanceSection = sectionName;

        switch (sectionName) {
            case 'transactions':
                renderTransactionsTable();
                break;
            case 'categories':
                renderCategoriesGrid();
                break;
            case 'reports':
                // Reports già renderizzati staticamente
                break;
        }
    }

    function initFinance() {
        updateFinanceStats();
        switchFinanceSection('transactions');

        // Event listeners
        document.querySelectorAll('.finance-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                switchFinanceSection(tab.dataset.section);
            });
        });

        // Add transaction button
        const addTransactionBtn = document.getElementById('add-transaction-btn');
        if (addTransactionBtn) {
            addTransactionBtn.addEventListener('click', () => {
                showNotification('Funzione "Nuova Transazione" in sviluppo', 'info');
            });
        }

        // Add category button
        const addCategoryBtn = document.getElementById('add-category-btn');
        if (addCategoryBtn) {
            addCategoryBtn.addEventListener('click', () => {
                showNotification('Funzione "Nuova Categoria" in sviluppo', 'info');
            });
        }
    }

    // ===== FUNZIONI CALENDARIO =====

    function updateCalendarStats() {
        const totalEvents = eventsData.length;
        const upcomingEvents = eventsData.filter(e => new Date(e.date) > today).length;
        const totalAttendees = eventsData.reduce((sum, e) => sum + e.attendees, 0);
        const featuredEvents = eventsData.filter(e => e.type === 'special').length;

        document.getElementById('total-events').textContent = totalEvents;
        document.getElementById('upcoming-events').textContent = upcomingEvents;
        document.getElementById('total-attendees').textContent = totalAttendees;
        document.getElementById('featured-events').textContent = featuredEvents;
    }

    function getEventsForDate(date) {
        const dateString = date.toISOString().split('T')[0];
        return eventsData.filter(event => event.date === dateString);
    }

    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    function isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    function generateCalendar() {
        const calendarGrid = document.getElementById('calendar-grid');
        const currentMonthElement = document.getElementById('current-month');

        if (!calendarGrid || !currentMonthElement) return;

        // Aggiorna il titolo del mese
        currentMonthElement.textContent = `${monthNames[currentCalendarDate.getMonth()]} ${currentCalendarDate.getFullYear()}`;

        // Pulisci il calendario
        calendarGrid.innerHTML = '';

        // Aggiungi i nomi dei giorni
        dayNames.forEach(dayName => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = dayName;
            calendarGrid.appendChild(dayHeader);
        });

        // Calcola il primo giorno del mese e il numero di giorni
        const firstDay = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), 1);
        const lastDay = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        // Aggiungi giorni del mese precedente per riempire la prima settimana
        const prevMonth = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 0);
        const daysInPrevMonth = prevMonth.getDate();

        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const dayNumber = daysInPrevMonth - i;
            const date = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, dayNumber);
            const dayElement = createCalendarDay(date, dayNumber, true);
            calendarGrid.appendChild(dayElement);
        }

        // Aggiungi i giorni del mese corrente
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), day);
            const dayElement = createCalendarDay(date, day, false);
            calendarGrid.appendChild(dayElement);
        }

        // Aggiungi giorni del mese successivo per riempire l'ultima settimana
        const totalCells = calendarGrid.children.length - 7; // Sottrai i 7 header
        const remainingCells = 42 - totalCells; // 6 settimane * 7 giorni = 42 celle

        for (let day = 1; day <= remainingCells; day++) {
            const date = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, day);
            const dayElement = createCalendarDay(date, day, true);
            calendarGrid.appendChild(dayElement);
        }
    }

    function createCalendarDay(date, dayNumber, isOtherMonth) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        if (isOtherMonth) {
            dayElement.classList.add('other-month');
        }

        if (isSameDay(date, today)) {
            dayElement.classList.add('today');
        }

        // Numero del giorno
        const dayNumberElement = document.createElement('div');
        dayNumberElement.className = 'calendar-day-number';
        dayNumberElement.textContent = dayNumber;
        dayElement.appendChild(dayNumberElement);

        // Eventi per questo giorno
        const dayEvents = getEventsForDate(date);
        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'calendar-events';

        dayEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = `calendar-event event-${event.status}`;
            eventElement.style.backgroundColor = event.color;
            eventElement.textContent = event.title;
            eventElement.title = `${event.title} - ${event.attendees} partecipanti`;
            eventElement.addEventListener('click', (e) => {
                e.stopPropagation();
                showEventDetails(event);
            });
            eventsContainer.appendChild(eventElement);
        });

        dayElement.appendChild(eventsContainer);

        // Click sul giorno per aggiungere evento
        dayElement.addEventListener('click', () => {
            if (!isOtherMonth) {
                showAddEventDialog(date);
            }
        });

        return dayElement;
    }

    function showEventDetails(event) {
        const statusText = event.status === 'confirmed' ? 'Confermato' : 'Pianificato';
        const typeText = event.type === 'special' ? 'Speciale' :
                        event.type === 'private' ? 'Privato' : 'Regolare';

        showNotification(
            `📅 ${event.title}\n` +
            `📅 Data: ${new Date(event.date).toLocaleDateString('it-IT')}\n` +
            `👥 Partecipanti: ${event.attendees}\n` +
            `📋 Stato: ${statusText}\n` +
            `🏷️ Tipo: ${typeText}`,
            'info'
        );
    }

    function showAddEventDialog(date) {
        const dateString = date.toLocaleDateString('it-IT');
        showNotification(`Aggiungi evento per il ${dateString} - Funzione in sviluppo`, 'info');
    }

    function navigateMonth(direction) {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + direction);
        generateCalendar();
    }

    function renderEventsList() {
        const eventsList = document.getElementById('events-list');
        if (!eventsList) return;

        eventsList.innerHTML = '';
        eventsData.forEach(event => {
            const card = document.createElement('div');
            card.className = 'event-card';
            card.style.borderLeft = `4px solid ${event.color}`;

            const typeText = event.type === 'special' ? 'Speciale' :
                           event.type === 'private' ? 'Privato' : 'Regolare';

            card.innerHTML = `
                <div class="event-card-header">
                    <div>
                        <div class="event-title" style="color: ${event.color};">${event.title}</div>
                        <div class="event-date">${new Date(event.date).toLocaleDateString('it-IT')}</div>
                        <div class="event-type" style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">
                            ${typeText}
                        </div>
                    </div>
                    <span class="status-badge status-${event.status}">
                        ${event.status === 'confirmed' ? 'Confermato' : 'Pianificato'}
                    </span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                    <span><i class="fas fa-users" style="color: ${event.color};"></i> ${event.attendees} partecipanti</span>
                    <div>
                        <button class="action-btn edit" onclick="editEvent(${event.id})" title="Modifica">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteEvent(${event.id})" title="Elimina">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            eventsList.appendChild(card);
        });
    }

    function renderTasksList() {
        const activeTasks = document.getElementById('active-tasks');
        const completedTasks = document.getElementById('completed-tasks');
        if (!activeTasks || !completedTasks) return;

        activeTasks.innerHTML = '';
        completedTasks.innerHTML = '';

        tasksData.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task-item';
            taskElement.innerHTML = `
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})">
                    ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <div class="task-text ${task.completed ? 'completed' : ''}">${task.text}</div>
                <button class="action-btn delete" onclick="deleteTask(${task.id})" title="Elimina">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            if (task.completed) {
                completedTasks.appendChild(taskElement);
            } else {
                activeTasks.appendChild(taskElement);
            }
        });
    }

    function switchCalendarSection(sectionName) {
        document.querySelectorAll('.calendar-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.calendar-section').forEach(section => section.classList.remove('active'));

        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        document.getElementById(`${sectionName}-section`).classList.add('active');

        currentCalendarSection = sectionName;

        switch (sectionName) {
            case 'calendar-view':
                generateCalendar();
                break;
            case 'events-list':
                renderEventsList();
                break;
            case 'planning':
                renderTasksList();
                break;
        }
    }

    function initCalendar() {
        updateCalendarStats();
        switchCalendarSection('calendar-view');

        // Event listeners
        document.querySelectorAll('.calendar-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                switchCalendarSection(tab.dataset.section);
            });
        });

        // Navigation buttons
        const prevMonthBtn = document.getElementById('prev-month-btn');
        const nextMonthBtn = document.getElementById('next-month-btn');

        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                navigateMonth(-1);
            });
        }

        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                navigateMonth(1);
            });
        }

        // Add event button
        const addEventBtn = document.getElementById('add-event-btn');
        if (addEventBtn) {
            addEventBtn.addEventListener('click', () => {
                showNotification('Funzione "Nuovo Evento" in sviluppo', 'info');
            });
        }

        // Add task button
        const addTaskBtn = document.getElementById('add-task-btn');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => {
                showNotification('Funzione "Nuovo Task" in sviluppo', 'info');
            });
        }
    }

    // ===== FUNZIONI RUBRICA =====

    function updateContactsStats() {
        const totalContacts = contactsData.length;
        const vipContacts = contactsData.filter(c => c.vip).length;
        const suppliersCount = suppliersData.length;
        const newContacts = Math.floor(Math.random() * 5) + 1; // Simulato

        document.getElementById('total-contacts').textContent = totalContacts;
        document.getElementById('vip-contacts').textContent = vipContacts;
        document.getElementById('suppliers-count').textContent = suppliersCount;
        document.getElementById('new-contacts').textContent = newContacts;
    }

    function renderContactsGrid() {
        const grid = document.getElementById('contacts-grid');
        if (!grid) return;

        grid.innerHTML = '';
        contactsData.forEach(contact => {
            const initials = contact.name.split(' ').map(n => n[0]).join('');
            const card = document.createElement('div');
            card.className = 'contact-card';
            card.innerHTML = `
                <div class="contact-avatar">${initials}</div>
                <div class="contact-name">${contact.name}</div>
                <div class="contact-info">
                    <div>${contact.phone}</div>
                    <div>${contact.email}</div>
                </div>
                <div class="contact-actions">
                    <button class="contact-action-btn primary" onclick="callContact('${contact.phone}')">
                        <i class="fas fa-phone"></i>
                        Chiama
                    </button>
                    <button class="contact-action-btn secondary" onclick="editContact(${contact.id})">
                        <i class="fas fa-edit"></i>
                        Modifica
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function renderVipGrid() {
        const grid = document.getElementById('vip-grid');
        if (!grid) return;

        grid.innerHTML = '';
        const vipContacts = contactsData.filter(c => c.vip);
        vipContacts.forEach(contact => {
            const initials = contact.name.split(' ').map(n => n[0]).join('');
            const card = document.createElement('div');
            card.className = 'vip-card';
            card.innerHTML = `
                <div class="contact-avatar">${initials}</div>
                <div class="contact-name">${contact.name}</div>
                <div class="contact-info">
                    <div>${contact.phone}</div>
                    <div>${contact.email}</div>
                </div>
                <div class="contact-actions">
                    <button class="contact-action-btn primary" onclick="callContact('${contact.phone}')">
                        <i class="fas fa-phone"></i>
                        Chiama
                    </button>
                    <button class="contact-action-btn secondary" onclick="editContact(${contact.id})">
                        <i class="fas fa-edit"></i>
                        Modifica
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function renderSuppliersTable() {
        const tbody = document.getElementById('suppliers-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        suppliersData.forEach(supplier => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="supplier-name">${supplier.company}</div>
                </td>
                <td>${supplier.contact}</td>
                <td>
                    <span class="category-badge category-supplies">
                        ${supplier.category}
                    </span>
                </td>
                <td>${supplier.phone}</td>
                <td>${supplier.email}</td>
                <td>
                    <span class="status-badge status-${supplier.status === 'active' ? 'confirmed' : 'cancelled'}">
                        ${supplier.status === 'active' ? 'Attivo' : 'Inattivo'}
                    </span>
                </td>
                <td>
                    <button class="action-btn edit" onclick="editSupplier(${supplier.id})" title="Modifica">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteSupplier(${supplier.id})" title="Elimina">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function switchContactsSection(sectionName) {
        document.querySelectorAll('.contacts-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.contacts-section').forEach(section => section.classList.remove('active'));

        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        document.getElementById(`${sectionName}-section`).classList.add('active');

        currentContactsSection = sectionName;

        switch (sectionName) {
            case 'all-contacts':
                renderContactsGrid();
                break;
            case 'vip-clients':
                renderVipGrid();
                break;
            case 'suppliers':
                renderSuppliersTable();
                break;
        }
    }

    function initContacts() {
        updateContactsStats();
        switchContactsSection('all-contacts');

        // Event listeners
        document.querySelectorAll('.contacts-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                switchContactsSection(tab.dataset.section);
            });
        });

        // Add buttons
        const addContactBtn = document.getElementById('add-contact-btn');
        if (addContactBtn) {
            addContactBtn.addEventListener('click', () => {
                showNotification('Funzione "Nuovo Contatto" in sviluppo', 'info');
            });
        }

        const addVipBtn = document.getElementById('add-vip-btn');
        if (addVipBtn) {
            addVipBtn.addEventListener('click', () => {
                showNotification('Funzione "Aggiungi VIP" in sviluppo', 'info');
            });
        }

        const addSupplierBtn = document.getElementById('add-supplier-btn');
        if (addSupplierBtn) {
            addSupplierBtn.addEventListener('click', () => {
                showNotification('Funzione "Nuovo Fornitore" in sviluppo', 'info');
            });
        }
    }

    // ===== FUNZIONI STATISTICHE =====

    function switchStatisticsSection(sectionName) {
        document.querySelectorAll('.statistics-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.statistics-section').forEach(section => section.classList.remove('active'));

        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        document.getElementById(`${sectionName}-section`).classList.add('active');

        currentStatisticsSection = sectionName;
    }

    function initStatistics() {
        switchStatisticsSection('overview');

        // Event listeners
        document.querySelectorAll('.statistics-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                switchStatisticsSection(tab.dataset.section);
            });
        });
    }

    // ===== FUNZIONI GLOBALI PER AZIONI =====

    // Transazioni
    window.editTransaction = function(transactionId) {
        showNotification('Modifica transazione in sviluppo', 'info');
    };

    window.deleteTransaction = function(transactionId) {
        const transaction = transactionsData.find(t => t.id === transactionId);
        if (transaction && confirm(`Sei sicuro di voler eliminare "${transaction.description}"?`)) {
            const index = transactionsData.findIndex(t => t.id === transactionId);
            transactionsData.splice(index, 1);
            renderTransactionsTable();
            updateFinanceStats();
            showNotification('Transazione eliminata', 'success');
        }
    };

    window.editCategory = function(categoryId) {
        showNotification('Modifica categoria in sviluppo', 'info');
    };

    // Eventi
    window.editEvent = function(eventId) {
        showNotification('Modifica evento in sviluppo', 'info');
    };

    window.deleteEvent = function(eventId) {
        const event = eventsData.find(e => e.id === eventId);
        if (event && confirm(`Sei sicuro di voler eliminare "${event.title}"?`)) {
            const index = eventsData.findIndex(e => e.id === eventId);
            eventsData.splice(index, 1);
            renderEventsList();
            updateCalendarStats();
            showNotification('Evento eliminato', 'success');
        }
    };

    // Task
    window.toggleTask = function(taskId) {
        const task = tasksData.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            renderTasksList();
            showNotification(`Task ${task.completed ? 'completato' : 'riattivato'}`, 'success');
        }
    };

    window.deleteTask = function(taskId) {
        const task = tasksData.find(t => t.id === taskId);
        if (task && confirm(`Sei sicuro di voler eliminare questo task?`)) {
            const index = tasksData.findIndex(t => t.id === taskId);
            tasksData.splice(index, 1);
            renderTasksList();
            showNotification('Task eliminato', 'success');
        }
    };

    // Contatti
    window.callContact = function(phone) {
        showNotification(`Chiamata a ${phone} in sviluppo`, 'info');
    };

    window.editContact = function(contactId) {
        showNotification('Modifica contatto in sviluppo', 'info');
    };

    window.editSupplier = function(supplierId) {
        showNotification('Modifica fornitore in sviluppo', 'info');
    };

    window.deleteSupplier = function(supplierId) {
        const supplier = suppliersData.find(s => s.id === supplierId);
        if (supplier && confirm(`Sei sicuro di voler eliminare "${supplier.company}"?`)) {
            const index = suppliersData.findIndex(s => s.id === supplierId);
            suppliersData.splice(index, 1);
            renderSuppliersTable();
            updateContactsStats();
            showNotification('Fornitore eliminato', 'success');
        }
    };

    // Gestione hover per mostrare tooltip moderno (solo per zone interattive)
    zones.forEach(zone => {
        // Salta le zone con classe "no-hover"
        if (zone.classList.contains('no-hover')) {
            return;
        }

        zone.addEventListener('mouseenter', function(e) {
            const zoneId = this.dataset.zone;
            const data = zoneData[zoneId];

            if (data) {
                // Aggiorna l'icona del tooltip
                tooltipIcon.className = data.icon;

                // Aggiorna il nome della zona
                tooltipZone.textContent = data.name;

                if (data.total > 0) {
                    const percentage = getOccupancyPercentage(data.occupied, data.total);
                    const color = getOccupancyColor(percentage);

                    tooltipOccupancy.innerHTML = `
                        <div style="margin-bottom: 0.5rem;">
                            <strong>${data.occupied}/${data.total} persone</strong> (${percentage}%)
                        </div>
                        <div style="font-size: 0.75rem; opacity: 0.8;">
                            ${data.description}
                        </div>
                    `;

                    // Aggiorna la barra di occupazione
                    tooltipBar.style.width = `${percentage}%`;
                    tooltipBar.style.background = color;
                } else {
                    tooltipOccupancy.innerHTML = `
                        <div style="margin-bottom: 0.5rem;">
                            <strong>Area di servizio</strong>
                        </div>
                        <div style="font-size: 0.75rem; opacity: 0.8;">
                            ${data.description}
                        </div>
                    `;

                    // Nascondi la barra per aree di servizio
                    tooltipBar.style.width = '0%';
                }

                tooltip.classList.add('show');

                // Aggiungi effetto di pulsazione alla zona
                this.style.animation = 'pulse 2s infinite';
            }
        });

        zone.addEventListener('mouseleave', function() {
            tooltip.classList.remove('show');
            // Rimuovi l'animazione di pulsazione
            this.style.animation = '';
        });

        zone.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();

            // Posiziona il tooltip in modo intelligente
            let left = e.pageX + 15;
            let top = e.pageY - 15;

            // Evita che il tooltip esca dallo schermo
            if (left + tooltipRect.width > window.innerWidth) {
                left = e.pageX - tooltipRect.width - 15;
            }
            if (top < 0) {
                top = e.pageY + 15;
            }

            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
        });

        // Click sulla zona con feedback visivo
        zone.addEventListener('click', function() {
            const zoneId = this.dataset.zone;
            const data = zoneData[zoneId];

            // Effetto di click
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            console.log(`Zona selezionata: ${data.name}`);
            console.log('Dati zona:', data);

            // Qui si potrebbero aggiungere funzionalità come:
            // - Aprire un modal con dettagli della zona
            // - Modificare l'occupazione
            // - Gestire prenotazioni
            // - Visualizzare analytics della zona
            // - etc.

            // Esempio di notifica (potresti sostituire con un modal)
            showNotification(`Zona ${data.name} selezionata`, 'info');
        });
    });

    // Funzione per mostrare notifiche
    function showNotification(message, type = 'info') {
        // Crea elemento notifica
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'info' ? 'info-circle' : type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // Stili per la notifica
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'info' ? '#3b82f6' : type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: '10000',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        document.body.appendChild(notification);

        // Animazione di entrata
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Rimozione automatica
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Aggiungi animazione CSS per il pulse
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
            100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }

        .notification {
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            font-size: 0.875rem;
        }
    `;
    document.head.appendChild(style);

    // Funzione per aggiornare i dati in tempo reale (simulazione)
    function simulateRealTimeUpdates() {
        setInterval(() => {
            let hasChanges = false;

            // Simula cambiamenti casuali nell'occupazione (solo zone interattive)
            const serviceZones = ['dj', 'entrance', 'restrooms'];

            Object.keys(zoneData).forEach(zoneId => {
                const data = zoneData[zoneId];
                // Escludi zone di servizio dagli aggiornamenti automatici
                if (data.total > 0 && !serviceZones.includes(zoneId)) {
                    // Cambiamento casuale più realistico
                    const changeChance = Math.random();
                    if (changeChance < 0.3) { // 30% di possibilità di cambiamento
                        const change = Math.floor(Math.random() * 5) - 2; // -2 a +2
                        const newOccupied = Math.max(0, Math.min(data.total, data.occupied + change));

                        if (newOccupied !== data.occupied) {
                            data.occupied = newOccupied;
                            hasChanges = true;

                            // Aggiorna il colore della zona
                            const zone = document.querySelector(`[data-zone="${zoneId}"]`);
                            if (zone && !zone.classList.contains('no-hover')) {
                                updateZoneColor(zone, zoneId);
                            }
                        }
                    }
                }
            });

            // Aggiorna le statistiche se ci sono stati cambiamenti
            if (hasChanges) {
                updateNavbarStats();
            }
        }, 8000); // Aggiorna ogni 8 secondi
    }

    // Avvia la simulazione degli aggiornamenti in tempo reale
    simulateRealTimeUpdates();

    // API pubbliche per integrazioni esterne
    window.EasyDisco = {
        // Ottieni tutti i dati delle zone
        getZoneData: () => zoneData,

        // Aggiorna occupazione di una zona
        updateZoneOccupancy: (zoneId, occupied, total) => {
            if (zoneData[zoneId]) {
                zoneData[zoneId].occupied = occupied;
                if (total !== undefined) {
                    zoneData[zoneId].total = total;
                }

                const zone = document.querySelector(`[data-zone="${zoneId}"]`);
                if (zone) {
                    updateZoneColor(zone, zoneId);
                }

                updateNavbarStats();
                return true;
            }
            return false;
        },

        // Ottieni statistiche generali
        getOverallStats: () => {
            let totalCapacity = 0;
            let currentOccupancy = 0;

            Object.values(zoneData).forEach(zone => {
                if (zone.total > 0) {
                    totalCapacity += zone.total;
                    currentOccupancy += zone.occupied;
                }
            });

            return {
                totalCapacity,
                currentOccupancy,
                percentage: totalCapacity > 0 ? Math.round((currentOccupancy / totalCapacity) * 100) : 0
            };
        },

        // Gestione tema
        theme: {
            // Ottieni tema corrente
            getCurrent: () => body.getAttribute('data-theme') || 'dark',

            // Imposta tema specifico
            set: (theme) => {
                if (theme === 'light' || theme === 'dark') {
                    applyTheme(theme);
                    return true;
                }
                return false;
            },

            // Toggle tema
            toggle: toggleTheme,

            // Reset alle preferenze di sistema
            resetToSystem: () => {
                localStorage.removeItem('easy-disco-theme');
                const systemTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                applyTheme(systemTheme);
            }
        },

        // Gestione navigazione
        navigation: {
            // Ottieni sezione corrente
            getCurrentSection: () => getActiveSection(),

            // Cambia sezione
            switchTo: (sectionName) => {
                const validSections = ['home', 'cambusa', 'pr', 'entrate-uscite', 'calendario', 'rubrica', 'statistiche'];
                if (validSections.includes(sectionName)) {
                    switchSection(sectionName);
                    return true;
                }
                return false;
            },

            // Lista delle sezioni disponibili
            getAvailableSections: () => ['home', 'cambusa', 'pr', 'entrate-uscite', 'calendario', 'rubrica', 'statistiche']
        },

        // Mostra notifica
        showNotification
    };

    console.log('🎵 Easy Disco - Gestionale caricato correttamente!');
    console.log('📊 Dati zone disponibili:', zoneData);
    console.log('🔧 API disponibili:', Object.keys(window.EasyDisco));
    console.log(`🎨 Tema attivo: ${initialTheme}`);
    console.log(`📄 Sezione attiva: ${initialSection}`);

    // Mostra notifica di benvenuto
    setTimeout(() => {
        const themeIcon = initialTheme === 'light' ? '☀️' : '🌙';
        showNotification(`${themeIcon} Easy Disco attivato! Layout a tre colonne pronto.`, 'success');
    }, 1000);
});
