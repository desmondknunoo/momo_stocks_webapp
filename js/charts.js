/**
 * MoMo Stocks - Chart Components
 * Using Canvas API for lightweight chart rendering
 */

const Charts = {
    // Color palette
    colors: {
        primary: 'rgb(172, 113, 206)',
        primarySoft: 'rgb(165, 152, 249)',
        success: '#00C853',
        error: '#FF1744',
        grid: 'rgba(255, 255, 255, 0.05)',
        gridLight: 'rgba(0, 0, 0, 0.05)',
        text: '#B3B3B3',
        textLight: '#666666'
    },

    // Get theme-aware colors
    getColors() {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        return {
            ...this.colors,
            grid: isDark ? this.colors.grid : this.colors.gridLight,
            text: isDark ? this.colors.text : this.colors.textLight
        };
    },

    /**
     * Draw a mini line chart (for cards)
     */
    miniLineChart(canvas, data, isPositive = true) {
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        // Set canvas size accounting for device pixel ratio
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;
        const padding = 2;

        if (data.length < 2) return;

        // Calculate min/max for scaling
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;

        // Calculate points
        const points = data.map((value, i) => ({
            x: padding + (i / (data.length - 1)) * (width - padding * 2),
            y: height - padding - ((value - min) / range) * (height - padding * 2)
        }));

        // Draw gradient fill
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        const color = isPositive ? this.colors.success : this.colors.error;
        gradient.addColorStop(0, `${color}40`);
        gradient.addColorStop(1, `${color}00`);

        ctx.beginPath();
        ctx.moveTo(points[0].x, height);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(points[points.length - 1].x, height);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw line
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        // Smooth curve using bezier
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const cpx = (prev.x + curr.x) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, cpx, (prev.y + curr.y) / 2);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    },

    /**
     * Draw a full price chart with time axis
     */
    priceChart(canvas, data, options = {}) {
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const colors = this.getColors();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;
        const padding = { top: 20, right: 60, bottom: 30, left: 20 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        if (data.length < 2) return;

        // Calculate min/max
        const prices = data.map(d => d.price);
        const min = Math.min(...prices) * 0.995;
        const max = Math.max(...prices) * 1.005;
        const range = max - min;

        // Calculate points
        const points = data.map((d, i) => ({
            x: padding.left + (i / (data.length - 1)) * chartWidth,
            y: padding.top + (1 - (d.price - min) / range) * chartHeight,
            price: d.price
        }));

        // Draw grid lines
        ctx.strokeStyle = colors.grid;
        ctx.lineWidth = 1;

        // Horizontal grid lines
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (i / 4) * chartHeight;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();

            // Price labels
            const price = max - (i / 4) * range;
            ctx.fillStyle = colors.text;
            ctx.font = '11px JetBrains Mono';
            ctx.textAlign = 'left';
            ctx.fillText(price.toFixed(2), width - padding.right + 8, y + 4);
        }

        // Determine if overall positive or negative
        const isPositive = points[points.length - 1].price >= points[0].price;
        const lineColor = isPositive ? this.colors.success : this.colors.error;

        // Draw gradient fill
        const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
        gradient.addColorStop(0, `${lineColor}30`);
        gradient.addColorStop(1, `${lineColor}00`);

        ctx.beginPath();
        ctx.moveTo(points[0].x, height - padding.bottom);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw line
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw current price dot
        const lastPoint = points[points.length - 1];
        ctx.beginPath();
        ctx.arc(lastPoint.x, lastPoint.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = lineColor;
        ctx.fill();

        // Outer glow
        ctx.beginPath();
        ctx.arc(lastPoint.x, lastPoint.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = `${lineColor}40`;
        ctx.fill();
    },

    /**
     * Draw a pie chart for portfolio allocation
     */
    pieChart(canvas, data) {
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 20;
        const innerRadius = radius * 0.6; // Donut chart

        if (data.length === 0) return;

        // Calculate total
        const total = data.reduce((sum, d) => sum + d.value, 0);
        if (total === 0) return;

        // Color palette for sectors
        const colorPalette = [
            '#AC71CE', '#A598F9', '#00C853', '#4ECDC4',
            '#FFB300', '#FF6B6B', '#4FACFE', '#F093FB'
        ];

        let startAngle = -Math.PI / 2; // Start from top

        data.forEach((segment, i) => {
            const sliceAngle = (segment.value / total) * Math.PI * 2;
            const endAngle = startAngle + sliceAngle;
            const color = colorPalette[i % colorPalette.length];

            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();

            // Add slight gap between slices
            ctx.strokeStyle = document.documentElement.getAttribute('data-theme') === 'light' ? '#F5F5F7' : '#0D0D0D';
            ctx.lineWidth = 2;
            ctx.stroke();

            startAngle = endAngle;
        });

        // Draw center text
        const colors = this.getColors();
        ctx.fillStyle = colors.text;
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Portfolio', centerX, centerY - 8);
        ctx.font = '12px Inter';
        ctx.fillText('Allocation', centerX, centerY + 10);
    },

    /**
     * Draw order book depth chart
     */
    orderBookChart(canvas, bids, asks) {
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const colors = this.getColors();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;
        const midX = width / 2;

        // Normalize data
        const maxBid = Math.max(...bids.map(b => b.volume), 1);
        const maxAsk = Math.max(...asks.map(a => a.volume), 1);
        const maxVolume = Math.max(maxBid, maxAsk);

        const barHeight = height / Math.max(bids.length, asks.length, 1);

        // Draw bids (left side, green)
        bids.forEach((bid, i) => {
            const barWidth = (bid.volume / maxVolume) * (midX - 10);
            const y = i * barHeight;

            // Bar
            ctx.fillStyle = `${this.colors.success}40`;
            ctx.fillRect(midX - barWidth - 5, y + 2, barWidth, barHeight - 4);

            // Price label
            ctx.fillStyle = this.colors.success;
            ctx.font = '10px JetBrains Mono';
            ctx.textAlign = 'right';
            ctx.fillText(bid.price.toFixed(2), midX - barWidth - 10, y + barHeight / 2 + 3);
        });

        // Draw asks (right side, red)
        asks.forEach((ask, i) => {
            const barWidth = (ask.volume / maxVolume) * (midX - 10);
            const y = i * barHeight;

            // Bar
            ctx.fillStyle = `${this.colors.error}40`;
            ctx.fillRect(midX + 5, y + 2, barWidth, barHeight - 4);

            // Price label
            ctx.fillStyle = this.colors.error;
            ctx.font = '10px JetBrains Mono';
            ctx.textAlign = 'left';
            ctx.fillText(ask.price.toFixed(2), midX + barWidth + 10, y + barHeight / 2 + 3);
        });

        // Center line
        ctx.strokeStyle = colors.grid;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(midX, 0);
        ctx.lineTo(midX, height);
        ctx.stroke();
    },

    /**
     * Generate random price data for demo charts
     */
    generateDemoData(basePrice, points = 30, volatility = 0.02) {
        const data = [];
        let price = basePrice;

        for (let i = 0; i < points; i++) {
            const change = (Math.random() - 0.48) * volatility * price;
            price = Math.max(0.01, price + change);
            data.push({ price, time: i });
        }

        return data;
    },

    /**
     * Generate demo order book data
     */
    generateOrderBook(currentPrice, levels = 5) {
        const bids = [];
        const asks = [];

        for (let i = 0; i < levels; i++) {
            bids.push({
                price: currentPrice - (i + 1) * 0.01,
                volume: Math.floor(Math.random() * 10000) + 1000
            });
            asks.push({
                price: currentPrice + (i + 1) * 0.01,
                volume: Math.floor(Math.random() * 10000) + 1000
            });
        }

        return { bids, asks };
    }
};

// For module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Charts;
}
