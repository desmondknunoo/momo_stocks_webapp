/**
 * MoMo Stocks - Main Application
 */

// ===== Application Controller =====
const App = {
    // Refresh interval (30 seconds)
    REFRESH_INTERVAL: 30000,
    refreshTimer: null,

    // ===== Initialization =====
    async init() {
        console.log('[App] Initializing MoMo Stocks...');

        // Initialize store
        Store.init();

        // Setup event listeners
        this.setupNavigation();
        this.setupThemeToggle();
        this.setupModals();

        // Load initial data
        await this.loadInitialData();

        // Start auto-refresh
        this.startAutoRefresh();

        // Subscribe to store changes
        Store.subscribe(() => this.onStateChange());

        console.log('[App] Initialization complete');
    },

    // ===== Data Loading =====
    async loadInitialData() {
        try {
            Store.setLoading(true);
            Store.clearError();

            const stocks = await GSEAPI.getLiveStocks();
            Store.setStocks(stocks);

            // Update portfolio with current prices
            Store.loadPortfolio();

            // Render current screen
            this.renderCurrentScreen();

        } catch (error) {
            console.error('[App] Failed to load data:', error);
            Store.setError(error.message);
            this.showEmptyState();
        } finally {
            Store.setLoading(false);
        }
    },

    // ===== Auto Refresh =====
    startAutoRefresh() {
        this.refreshTimer = setInterval(async () => {
            try {
                const stocks = await GSEAPI.refreshData();
                Store.setStocks(stocks);
                Store.loadPortfolio();
                this.renderCurrentScreen();
                this.updateLastUpdatedTime();
            } catch (error) {
                console.error('[App] Refresh failed:', error);
            }
        }, this.REFRESH_INTERVAL);
    },

    stopAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
        }
    },

    updateLastUpdatedTime() {
        const el = document.getElementById('last-updated');
        if (el) {
            el.textContent = `Updated ${formatTime()}`;
        }
    },

    // ===== Navigation =====
    setupNavigation() {
        // Desktop sidebar nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const screen = item.dataset.screen;
                if (screen) this.navigateTo(screen);
            });
        });

        // Mobile bottom nav
        document.querySelectorAll('.bottom-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const screen = item.dataset.screen;
                if (screen) this.navigateTo(screen);
            });
        });
    },

    navigateTo(screen) {
        Store.setScreen(screen);

        // Update nav active states
        document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.screen === screen);
        });

        // Show/hide screens
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.toggle('active', s.id === `screen-${screen}`);
        });

        // Update header title
        const titles = {
            dashboard: 'Dashboard',
            market: 'Market',
            portfolio: 'Portfolio',
            trading: 'Trading',
            'gse-live': 'GSE Live'
        };
        const headerTitle = document.getElementById('header-title');
        if (headerTitle) {
            headerTitle.textContent = titles[screen] || 'MoMo Stocks';
        }

        // Render screen content
        this.renderCurrentScreen();
    },

    // ===== Theme Toggle =====
    setupThemeToggle() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                Store.toggleTheme();
                this.updateThemeIcon();
            });
        }
        this.updateThemeIcon();
    },

    updateThemeIcon() {
        const icon = document.querySelector('#theme-toggle svg');
        const label = document.querySelector('#theme-toggle .theme-toggle-label span');
        const state = Store.getState();

        if (icon) {
            icon.innerHTML = state.theme === 'dark'
                ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
                : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
        }
        if (label) {
            label.textContent = state.theme === 'dark' ? 'Dark Mode' : 'Light Mode';
        }
    },

    // ===== Modals =====
    setupModals() {
        // Close modal on backdrop click
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    this.closeModal(backdrop.parentElement.id);
                }
            });
        });

        // Close buttons
        document.querySelectorAll('[data-close-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) this.closeModal(modal.id);
            });
        });
    },

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    // ===== State Change Handler =====
    onStateChange() {
        // React to state changes if needed
    },

    // ===== Screen Rendering =====
    renderCurrentScreen() {
        const state = Store.getState();

        switch (state.currentScreen) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'market':
                this.renderMarket();
                break;
            case 'portfolio':
                this.renderPortfolio();
                break;
            case 'trading':
                this.renderTrading();
                break;
            case 'gse-live':
                this.renderGSELive();
                break;
        }
    },

    // ===== Dashboard Screen =====
    renderDashboard() {
        const state = Store.getState();

        // Portfolio summary
        this.renderPortfolioSummary();

        // Market indices carousel
        this.renderMarketIndices();

        // Watchlist
        this.renderWatchlist();

        // AI Insights
        this.renderAIInsights();
    },

    renderPortfolioSummary() {
        const state = Store.getState();
        const { portfolio } = state;

        const valueEl = document.getElementById('portfolio-value');
        const changeEl = document.getElementById('portfolio-change');
        const chartCanvas = document.getElementById('portfolio-mini-chart');

        if (valueEl) {
            valueEl.textContent = formatCurrency(portfolio.totalValue);
        }

        if (changeEl) {
            const isPositive = portfolio.totalGainLoss >= 0;
            changeEl.className = `portfolio-change ${isPositive ? 'text-success' : 'text-error'}`;
            changeEl.innerHTML = `
        ${formatCurrency(portfolio.totalGainLoss, true)}
        <span class="badge badge-lg ${isPositive ? 'badge-success' : 'badge-error'}">
          ${formatPercent(portfolio.gainLossPercent || 0)}
        </span>
      `;
        }

        if (chartCanvas) {
            // Generate demo portfolio chart data
            const demoData = [];
            let value = portfolio.totalValue * 0.95;
            for (let i = 0; i < 30; i++) {
                value += (Math.random() - 0.45) * portfolio.totalValue * 0.02;
                demoData.push(Math.max(0, value));
            }
            demoData.push(portfolio.totalValue);

            Charts.miniLineChart(chartCanvas, demoData, portfolio.totalGainLoss >= 0);
        }
    },

    renderMarketIndices() {
        const state = Store.getState();
        const container = document.getElementById('market-indices');
        if (!container) return;

        // Get top 6 stocks as market indices
        const indices = state.stocks.slice(0, 6);

        container.innerHTML = indices.map(stock => `
      <div class="card card-interactive" onclick="App.showStockDetail('${stock.symbol}')" style="min-width: 200px;">
        <div class="flex items-center gap-3 mb-3">
          <div class="stock-logo" style="width: 36px; height: 36px; font-size: 14px; background: ${getStockColor(stock.symbol)}">
            ${getStockInitials(stock.symbol)}
          </div>
          <span class="text-sm font-semibold">${stock.symbol}</span>
        </div>
        <div class="text-mono font-bold text-xl">${formatCurrency(stock.price).replace('GHS ', '')}</div>
        <div class="badge ${stock.isPositive ? 'badge-success' : stock.isNegative ? 'badge-error' : 'badge-neutral'} mt-2">
          ${formatPercent(stock.changePercent)}
        </div>
      </div>
    `).join('');
    },

    renderWatchlist() {
        const state = Store.getState();
        const container = document.getElementById('watchlist-container');
        if (!container) return;

        const watchlistStocks = Store.getWatchlistStocks();

        if (watchlistStocks.length === 0) {
            container.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <h4 class="empty-state-title">No stocks in watchlist</h4>
          <p class="empty-state-description">Add stocks to your watchlist from the Market screen</p>
        </div>
      `;
            return;
        }

        container.innerHTML = `
      <div class="stock-list">
        ${watchlistStocks.slice(0, 5).map(stock => this.createStockItem(stock)).join('')}
      </div>
    `;
    },

    renderAIInsights() {
        const state = Store.getState();
        const container = document.getElementById('ai-insights');
        if (!container) return;

        // Find top performer for AI insight
        const topPerformer = state.stocks.reduce((top, stock) =>
            !top || stock.changePercent > top.changePercent ? stock : top
            , null);

        if (!topPerformer) return;

        container.innerHTML = `
      <div class="ai-insight">
        <div class="ai-insight-header">
          <svg class="ai-insight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          <span class="ai-insight-label">AI Insight</span>
        </div>
        <p class="ai-insight-content">
          <strong>${topPerformer.symbol}</strong> is today's top performer with a 
          <span class="text-success">${formatPercent(topPerformer.changePercent)}</span> gain. 
          Consider reviewing your position or adding to your watchlist.
        </p>
      </div>
    `;
    },

    // ===== Market Screen =====
    renderMarket() {
        const state = Store.getState();

        // Render summary cards
        this.renderMarketSummaryCards();

        // Render stock list
        this.renderStockList();
    },

    renderMarketSummaryCards() {
        const state = Store.getState();

        // Top performer
        const topPerformer = state.stocks.reduce((top, stock) =>
            !top || stock.changePercent > top.changePercent ? stock : top
            , null);

        const topPerformerCard = document.getElementById('top-performer-card');
        if (topPerformerCard && topPerformer) {
            topPerformerCard.innerHTML = `
        <div class="card-header">
          <span class="card-title">Top Performer</span>
          <span class="badge badge-success">Today</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="stock-logo" style="background: ${getStockColor(topPerformer.symbol)}">
            ${getStockInitials(topPerformer.symbol)}
          </div>
          <div>
            <div class="text-lg font-bold">${topPerformer.symbol}</div>
            <div class="text-muted text-sm">Vol: ${abbreviateNumber(topPerformer.volume)}</div>
          </div>
          <div class="text-right ml-auto">
            <div class="text-mono font-bold">${formatCurrency(topPerformer.price).replace('GHS ', '')}</div>
            <span class="badge badge-success">${formatPercent(topPerformer.changePercent)}</span>
          </div>
        </div>
      `;
        }

        // GSE Composite
        const totalVolume = state.stocks.reduce((sum, s) => sum + (s.volume || 0), 0);
        const gseCard = document.getElementById('gse-composite-card');
        if (gseCard) {
            gseCard.innerHTML = `
        <div class="card-header">
          <span class="card-title">GSE Composite</span>
          <span class="badge badge-info">Index</span>
        </div>
        <div class="text-mono text-3xl font-bold mb-2">3,245.67</div>
        <div class="flex items-center gap-4 text-sm text-muted">
          <span>Vol: ${abbreviateNumber(totalVolume)}</span>
          <span>Stocks: ${state.stocks.length}</span>
        </div>
      `;
        }
    },

    renderStockList() {
        const state = Store.getState();
        const container = document.getElementById('stock-list');
        if (!container) return;

        if (state.isLoading) {
            container.innerHTML = Array(5).fill(0).map(() => `
        <div class="stock-item">
          <div class="stock-info">
            <div class="skeleton skeleton-circle" style="width: 48px; height: 48px;"></div>
            <div>
              <div class="skeleton skeleton-text" style="width: 80px;"></div>
              <div class="skeleton skeleton-text-sm" style="width: 60px;"></div>
            </div>
          </div>
          <div class="stock-price-section">
            <div class="skeleton skeleton-text" style="width: 60px;"></div>
            <div class="skeleton skeleton-text-sm" style="width: 50px;"></div>
          </div>
        </div>
      `).join('');
            return;
        }

        if (state.stocks.length === 0) {
            container.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 3v18h18"/>
            <path d="M18 17V9"/>
            <path d="M13 17V5"/>
            <path d="M8 17v-3"/>
          </svg>
          <h4 class="empty-state-title">No stock data available</h4>
          <p class="empty-state-description">Unable to fetch data from GSE API. Please try again later.</p>
        </div>
      `;
            return;
        }

        container.innerHTML = state.stocks.map(stock => this.createStockItem(stock)).join('');
    },

    createStockItem(stock) {
        return `
      <div class="stock-item" onclick="App.showStockDetail('${stock.symbol}')">
        <div class="stock-info">
          <div class="stock-logo" style="background: ${getStockColor(stock.symbol)}">
            ${getStockInitials(stock.symbol)}
          </div>
          <div>
            <div class="stock-name">${stock.symbol}</div>
            <div class="stock-volume">Vol: ${abbreviateNumber(stock.volume || 0)}</div>
          </div>
        </div>
        <div class="stock-price-section">
          <div class="stock-price">GHS ${stock.price.toFixed(2)}</div>
          <span class="stock-change badge ${stock.isPositive ? 'badge-success' : stock.isNegative ? 'badge-error' : 'badge-neutral'}">
            ${formatPercent(stock.changePercent)}
          </span>
        </div>
      </div>
    `;
    },

    // ===== Portfolio Screen =====
    renderPortfolio() {
        const state = Store.getState();

        // Portfolio value card
        this.renderPortfolioCard();

        // Holdings list
        this.renderHoldings();

        // Allocation chart
        this.renderAllocationChart();

        // Transactions
        this.renderTransactions();
    },

    renderPortfolioCard() {
        const state = Store.getState();
        const { portfolio } = state;

        const card = document.getElementById('portfolio-card');
        if (!card) return;

        const isPositive = portfolio.totalGainLoss >= 0;

        card.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <div>
          <div class="text-sm text-muted mb-1">Total Portfolio Value</div>
          <div class="text-4xl font-bold text-mono">${formatCurrency(portfolio.totalValue)}</div>
        </div>
        <span class="badge badge-lg ${isPositive ? 'badge-success' : 'badge-error'}">
          ${formatPercent(portfolio.gainLossPercent || 0)}
        </span>
      </div>
      <div class="text-sm ${isPositive ? 'text-success' : 'text-error'}">
        ${formatCurrency(portfolio.totalGainLoss, true)} today
      </div>
      <canvas id="portfolio-chart" style="width: 100%; height: 120px; margin-top: 16px;"></canvas>
    `;

        // Draw chart
        setTimeout(() => {
            const canvas = document.getElementById('portfolio-chart');
            if (canvas) {
                const demoData = Charts.generateDemoData(portfolio.totalValue || 1000, 30);
                Charts.priceChart(canvas, demoData);
            }
        }, 100);
    },

    renderHoldings() {
        const state = Store.getState();
        const container = document.getElementById('holdings-list');
        if (!container) return;

        const { holdings } = state.portfolio;

        if (holdings.length === 0) {
            container.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <h4 class="empty-state-title">No holdings yet</h4>
          <p class="empty-state-description">Start trading to build your portfolio</p>
          <button class="btn btn-primary mt-4" onclick="App.navigateTo('trading')">Start Trading</button>
        </div>
      `;
            return;
        }

        container.innerHTML = holdings.map(holding => {
            const isPositive = holding.gainLoss >= 0;
            return `
        <div class="stock-item" onclick="App.showStockDetail('${holding.symbol}')">
          <div class="stock-info">
            <div class="stock-logo" style="background: ${getStockColor(holding.symbol)}">
              ${getStockInitials(holding.symbol)}
            </div>
            <div>
              <div class="stock-name">${holding.symbol}</div>
              <div class="stock-volume">${holding.shares} shares @ ${formatCurrency(holding.averagePrice)}</div>
            </div>
          </div>
          <div class="stock-price-section">
            <div class="stock-price">${formatCurrency(holding.currentValue || 0)}</div>
            <span class="stock-change badge ${isPositive ? 'badge-success' : 'badge-error'}">
              ${formatCurrency(holding.gainLoss || 0, true)}
            </span>
          </div>
        </div>
      `;
        }).join('');
    },

    renderAllocationChart() {
        const state = Store.getState();
        const canvas = document.getElementById('allocation-chart');
        if (!canvas) return;

        const { holdings } = state.portfolio;

        if (holdings.length === 0) {
            canvas.style.display = 'none';
            return;
        }

        canvas.style.display = 'block';

        const data = holdings.map(h => ({
            label: h.symbol,
            value: h.currentValue || 0
        }));

        Charts.pieChart(canvas, data);

        // Render legend
        const legend = document.getElementById('allocation-legend');
        if (legend) {
            const colorPalette = ['#AC71CE', '#A598F9', '#00C853', '#4ECDC4', '#FFB300', '#FF6B6B', '#4FACFE', '#F093FB'];
            const total = data.reduce((sum, d) => sum + d.value, 0);

            legend.innerHTML = data.map((d, i) => `
        <div class="flex items-center gap-2 text-sm">
          <span class="w-3 h-3 rounded-full" style="background: ${colorPalette[i % colorPalette.length]}"></span>
          <span class="text-secondary">${d.label}</span>
          <span class="ml-auto text-mono">${((d.value / total) * 100).toFixed(1)}%</span>
        </div>
      `).join('');
        }
    },

    renderTransactions() {
        const state = Store.getState();
        const container = document.getElementById('transactions-list');
        if (!container) return;

        const { transactions } = state;

        if (transactions.length === 0) {
            container.innerHTML = '<p class="text-muted text-center p-4">No transactions yet</p>';
            return;
        }

        container.innerHTML = transactions.slice(0, 10).map(tx => `
      <div class="flex items-center justify-between p-3 border-b" style="border-color: var(--border-default);">
        <div class="flex items-center gap-3">
          <span class="badge ${tx.type === 'BUY' ? 'badge-success' : 'badge-error'}">${tx.type}</span>
          <div>
            <div class="font-semibold">${tx.symbol}</div>
            <div class="text-sm text-muted">${tx.quantity} shares @ ${formatCurrency(tx.price)}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-mono font-semibold">${formatCurrency(tx.total)}</div>
          <div class="text-xs text-muted">${getRelativeTime(new Date(tx.date))}</div>
        </div>
      </div>
    `).join('');
    },

    // ===== Trading Screen =====
    renderTrading() {
        const state = Store.getState();

        // Stock selector
        this.renderTradingStockList();

        // Setup trading form
        this.setupTradingForm();
    },

    renderTradingStockList() {
        const state = Store.getState();
        const container = document.getElementById('trading-stock-list');
        if (!container) return;

        container.innerHTML = state.stocks.map(stock => `
      <div class="stock-item" onclick="App.selectTradingStock('${stock.symbol}')">
        <div class="stock-info">
          <div class="stock-logo" style="width: 36px; height: 36px; font-size: 12px; background: ${getStockColor(stock.symbol)}">
            ${getStockInitials(stock.symbol)}
          </div>
          <div>
            <div class="stock-name">${stock.symbol}</div>
          </div>
        </div>
        <div class="stock-price-section">
          <div class="stock-price text-sm">GHS ${stock.price.toFixed(2)}</div>
        </div>
      </div>
    `).join('');
    },

    selectTradingStock(symbol) {
        const stock = Store.getStockBySymbol(symbol);
        if (!stock) return;

        Store.setSelectedStock(stock);

        // Show trading panel
        const panel = document.getElementById('trading-panel');
        const selector = document.getElementById('trading-stock-selector');

        if (panel) panel.classList.add('active');
        if (selector) selector.classList.add('hidden');

        // Update trading panel
        this.updateTradingPanel(stock);
    },

    updateTradingPanel(stock) {
        // Header
        const header = document.getElementById('trading-stock-header');
        if (header) {
            header.innerHTML = `
        <div class="flex items-center gap-3">
          <button class="btn-icon" onclick="App.closeTradingPanel()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div class="stock-logo" style="width: 40px; height: 40px; background: ${getStockColor(stock.symbol)}">
            ${getStockInitials(stock.symbol)}
          </div>
          <div>
            <div class="font-bold text-lg">${stock.symbol}</div>
            <div class="text-sm text-muted">GHS ${stock.price.toFixed(2)}</div>
          </div>
        </div>
        <span class="badge ${stock.isPositive ? 'badge-success' : 'badge-error'}">
          ${formatPercent(stock.changePercent)}
        </span>
      `;
        }

        // Update price input default
        const priceInput = document.getElementById('trade-price');
        if (priceInput) {
            priceInput.value = stock.price.toFixed(2);
        }

        // Order book
        const orderBookCanvas = document.getElementById('order-book-chart');
        if (orderBookCanvas) {
            const { bids, asks } = Charts.generateOrderBook(stock.price);
            Charts.orderBookChart(orderBookCanvas, bids, asks);
        }
    },

    closeTradingPanel() {
        const panel = document.getElementById('trading-panel');
        const selector = document.getElementById('trading-stock-selector');

        if (panel) panel.classList.remove('active');
        if (selector) selector.classList.remove('hidden');

        Store.setSelectedStock(null);
    },

    setupTradingForm() {
        // Trade type toggle
        document.querySelectorAll('[data-trade-type]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-trade-type]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const submitBtn = document.getElementById('submit-trade');
                if (submitBtn) {
                    const isBuy = btn.dataset.tradeType === 'buy';
                    submitBtn.className = `btn btn-lg btn-full ${isBuy ? 'btn-success' : 'btn-error'}`;
                    submitBtn.textContent = isBuy ? 'Place Buy Order' : 'Place Sell Order';
                }
            });
        });

        // Quantity input
        const quantityInput = document.getElementById('trade-quantity');
        const priceInput = document.getElementById('trade-price');
        const totalDisplay = document.getElementById('trade-total');

        const updateTotal = () => {
            const quantity = parseInt(quantityInput?.value) || 0;
            const price = parseFloat(priceInput?.value) || 0;
            if (totalDisplay) {
                totalDisplay.textContent = formatCurrency(quantity * price);
            }
        };

        if (quantityInput) quantityInput.addEventListener('input', updateTotal);
        if (priceInput) priceInput.addEventListener('input', updateTotal);

        // Submit trade
        const submitBtn = document.getElementById('submit-trade');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.executeTrade());
        }
    },

    executeTrade() {
        const state = Store.getState();
        const stock = state.selectedStock;
        if (!stock) return;

        const tradeType = document.querySelector('[data-trade-type].active')?.dataset.tradeType || 'buy';
        const quantity = parseInt(document.getElementById('trade-quantity')?.value) || 0;
        const price = parseFloat(document.getElementById('trade-price')?.value) || stock.price;

        if (quantity <= 0) {
            alert('Please enter a valid quantity');
            return;
        }

        if (tradeType === 'buy') {
            Store.addHolding(stock.symbol, quantity, price);
        } else {
            Store.removeHolding(stock.symbol, quantity, price);
        }

        // Show success message
        this.showToast(`${tradeType === 'buy' ? 'Bought' : 'Sold'} ${quantity} shares of ${stock.symbol}`, 'success');

        // Reset form
        document.getElementById('trade-quantity').value = '';
        this.closeTradingPanel();
    },

    // ===== GSE Live Screen =====
    renderGSELive() {
        const state = Store.getState();

        // Market status
        this.renderMarketStatus();

        // Stats grid
        this.renderLiveStats();

        // Top movers
        this.renderTopMovers();
    },

    renderMarketStatus() {
        const container = document.getElementById('market-status');
        if (!container) return;

        // Determine if market is open (Mon-Fri, 10am-3pm GMT)
        const now = new Date();
        const hour = now.getUTCHours();
        const day = now.getUTCDay();
        const isOpen = day >= 1 && day <= 5 && hour >= 10 && hour < 15;

        container.innerHTML = `
      <div class="card flex justify-between items-center">
        <div>
          <div class="text-sm text-muted mb-1">Market Status</div>
          <div class="market-status ${isOpen ? 'open' : 'closed'}">
            <span class="market-status-dot"></span>
            ${isOpen ? 'OPEN' : 'CLOSED'}
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm text-muted mb-1">Last Update</div>
          <div class="text-mono font-semibold" id="last-updated">${formatTime()}</div>
        </div>
      </div>
    `;
    },

    renderLiveStats() {
        const state = Store.getState();
        const container = document.getElementById('live-stats');
        if (!container) return;

        const totalVolume = state.stocks.reduce((sum, s) => sum + (s.volume || 0), 0);
        const totalValue = state.stocks.reduce((sum, s) => sum + (s.price * (s.volume || 0)), 0);
        const gainers = state.stocks.filter(s => s.isPositive).length;
        const losers = state.stocks.filter(s => s.isNegative).length;

        container.innerHTML = `
      <div class="stat-card">
        <div class="stat-label">Volume</div>
        <div class="stat-value">${abbreviateNumber(totalVolume)}</div>
        <div class="stat-change text-success">+12.5%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Value (GHS)</div>
        <div class="stat-value">${abbreviateNumber(totalValue)}</div>
        <div class="stat-change text-success">+8.3%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Gainers</div>
        <div class="stat-value text-success">${gainers}</div>
        <div class="stat-change text-muted">stocks up</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Losers</div>
        <div class="stat-value text-error">${losers}</div>
        <div class="stat-change text-muted">stocks down</div>
      </div>
    `;
    },

    renderTopMovers() {
        const state = Store.getState();

        // Top gainers
        const gainersContainer = document.getElementById('top-gainers');
        if (gainersContainer) {
            const gainers = [...state.stocks]
                .filter(s => s.isPositive)
                .sort((a, b) => b.changePercent - a.changePercent)
                .slice(0, 5);

            gainersContainer.innerHTML = gainers.length > 0
                ? gainers.map(stock => this.createStockItem(stock)).join('')
                : '<p class="text-muted text-center p-4">No gainers today</p>';
        }

        // Top losers
        const losersContainer = document.getElementById('top-losers');
        if (losersContainer) {
            const losers = [...state.stocks]
                .filter(s => s.isNegative)
                .sort((a, b) => a.changePercent - b.changePercent)
                .slice(0, 5);

            losersContainer.innerHTML = losers.length > 0
                ? losers.map(stock => this.createStockItem(stock)).join('')
                : '<p class="text-muted text-center p-4">No losers today</p>';
        }
    },

    // ===== Stock Detail Modal =====
    async showStockDetail(symbol) {
        const stock = Store.getStockBySymbol(symbol);
        if (!stock) return;

        // Load detailed info
        let details = null;
        try {
            details = await GSEAPI.getEquityDetails(symbol);
        } catch (e) {
            console.error('Failed to load stock details:', e);
        }

        const modal = document.getElementById('stock-detail-modal');
        const content = document.getElementById('stock-detail-content');

        if (content) {
            content.innerHTML = `
        <div class="flex items-center gap-4 mb-6">
          <div class="stock-logo avatar-lg" style="background: ${getStockColor(stock.symbol)}">
            ${getStockInitials(stock.symbol)}
          </div>
          <div class="flex-1">
            <h2 class="text-2xl font-bold">${stock.symbol}</h2>
            ${details?.company?.fullName ? `<p class="text-muted">${details.company.fullName}</p>` : ''}
          </div>
          <span class="badge badge-lg ${stock.isPositive ? 'badge-success' : 'badge-error'}">
            ${formatPercent(stock.changePercent)}
          </span>
        </div>
        
        <div class="text-4xl font-bold text-mono mb-2">GHS ${stock.price.toFixed(2)}</div>
        <div class="text-sm ${stock.isPositive ? 'text-success' : 'text-error'} mb-6">
          ${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} (${formatPercent(stock.changePercent)})
        </div>
        
        <canvas id="stock-detail-chart" style="width: 100%; height: 200px;"></canvas>
        
        <div class="grid grid-2 gap-4 mt-6">
          <div class="stat-card">
            <div class="stat-label">Volume</div>
            <div class="stat-value">${abbreviateNumber(stock.volume || 0)}</div>
          </div>
          ${details ? `
            <div class="stat-card">
              <div class="stat-label">Market Cap</div>
              <div class="stat-value">${abbreviateNumber(details.marketCap || 0)}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">EPS</div>
              <div class="stat-value">${details.eps?.toFixed(2) || 'N/A'}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">DPS</div>
              <div class="stat-value">${details.dps?.toFixed(2) || 'N/A'}</div>
            </div>
          ` : ''}
        </div>
        
        ${details?.company ? `
          <div class="mt-6">
            <h4 class="font-bold mb-3">Company Info</h4>
            <div class="space-y-2 text-sm">
              ${details.company.sector ? `<p><span class="text-muted">Sector:</span> ${details.company.sector}</p>` : ''}
              ${details.company.industry ? `<p><span class="text-muted">Industry:</span> ${details.company.industry}</p>` : ''}
              ${details.company.website ? `<p><span class="text-muted">Website:</span> <a href="https://${details.company.website}" target="_blank">${details.company.website}</a></p>` : ''}
            </div>
          </div>
        ` : ''}
        
        <div class="flex gap-3 mt-6">
          <button class="btn btn-secondary flex-1" onclick="App.toggleWatchlist('${stock.symbol}')">
            ${Store.isInWatchlist(stock.symbol) ? '★ Remove from Watchlist' : '☆ Add to Watchlist'}
          </button>
          <button class="btn btn-primary flex-1" onclick="App.closeModal('stock-detail-modal'); App.navigateTo('trading'); App.selectTradingStock('${stock.symbol}');">
            Trade
          </button>
        </div>
      `;
        }

        this.openModal('stock-detail-modal');

        // Draw chart after modal is visible
        setTimeout(() => {
            const canvas = document.getElementById('stock-detail-chart');
            if (canvas) {
                const demoData = Charts.generateDemoData(stock.price, 50, 0.03);
                Charts.priceChart(canvas, demoData);
            }
        }, 100);
    },

    toggleWatchlist(symbol) {
        if (Store.isInWatchlist(symbol)) {
            Store.removeFromWatchlist(symbol);
            this.showToast(`${symbol} removed from watchlist`, 'info');
        } else {
            Store.addToWatchlist(symbol);
            this.showToast(`${symbol} added to watchlist`, 'success');
        }

        // Re-render if on dashboard
        if (Store.getState().currentScreen === 'dashboard') {
            this.renderWatchlist();
        }

        // Update modal button text
        const btn = document.querySelector(`[onclick*="toggleWatchlist('${symbol}')"]`);
        if (btn) {
            btn.textContent = Store.isInWatchlist(symbol) ? '★ Remove from Watchlist' : '☆ Add to Watchlist';
        }
    },

    // ===== Toast Notifications =====
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type} animate-slide-in-right`;
        toast.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()">×</button>
    `;

        container.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('animate-fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // ===== Empty State =====
    showEmptyState() {
        const screens = ['screen-dashboard', 'screen-market', 'screen-gse-live'];
        screens.forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (screen) {
                const content = screen.querySelector('.main-content');
                if (content) {
                    content.innerHTML = `
            <div class="empty-state" style="min-height: 60vh;">
              <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <h4 class="empty-state-title">Unable to load data</h4>
              <p class="empty-state-description">Please check your internet connection and try again.</p>
              <button class="btn btn-primary mt-4" onclick="App.loadInitialData()">Retry</button>
            </div>
          `;
                }
            }
        });
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
