document.addEventListener('DOMContentLoaded', () => {
    fetchOrders();
    fetchConfigs();
    fetchAnalytics();

    // Refresh orders every 30 seconds
    setInterval(fetchOrders, 30000);

    document.getElementById('settings-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const delay = document.getElementById('delay-input').value;
        try {
            await fetch('/api/v1/admin/configs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: 'confirmation_delay_minutes',
                    value: delay,
                    description: 'Delay in minutes before sending confirmation'
                })
            });
            alert('Settings saved!');
        } catch (e) {
            console.error("Error saving settings:", e);
            alert('Failed to save settings');
        }
    });
});

async function fetchOrders() {
    try {
        const res = await fetch('/api/v1/admin/orders');
        const orders = await res.json();
        const tbody = document.getElementById('orders-table-body');
        tbody.innerHTML = '';

        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No orders found</td></tr>';
            return;
        }

        orders.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${order.order_number}</td>
                <td>${order.customer_name}</td>
                <td>${order.total_price}</td>
                <td><span class="badge ${getStatusBadge(order.status)}">${order.status}</span></td>
                <td>${order.delivery_slot || '-'}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error("Error fetching orders:", e);
    }
}

async function fetchConfigs() {
    try {
        const res = await fetch('/api/v1/admin/configs');
        const data = await res.json();
        const delayConfig = data.find(c => c.key === 'confirmation_delay_minutes');
        if (delayConfig) {
            document.getElementById('delay-input').value = delayConfig.value;
        }
    } catch (e) {
        console.error("Error fetching configs:", e);
    }
}

async function fetchAnalytics() {
    try {
        const res = await fetch('/api/v1/admin/analytics');
        const data = await res.json();

        document.getElementById('total-orders').textContent = data.total_orders;
        document.getElementById('conf-rate').textContent = data.confirmed_rate.toFixed(1) + '%';
        document.getElementById('cancel-rate').textContent = data.cancellation_rate.toFixed(1) + '%';
        document.getElementById('success-rate').textContent = data.delivery_success_rate.toFixed(1) + '%';
    } catch (e) {
        console.error("Error fetching analytics:", e);
    }
}

function getStatusBadge(status) {
    switch (status) {
        case 'confirmed': return 'text-bg-success';
        case 'cancelled': return 'text-bg-danger';
        case 'pending': return 'text-bg-warning';
        case 'shipped': return 'text-bg-info';
        case 'delivered': return 'text-bg-primary';
        default: return 'text-bg-secondary';
    }
}
