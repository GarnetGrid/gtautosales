// ============================================================
//  Leads Manager — GT Auto Sales Admin
//  Handles lead display, filtering, detail drawer, similar leads
// ============================================================

import { supabase } from './services/supabaseClient.js';

let allLeads = [];
let currentLeadId = null;

// ─── Tab Switching ───
window.switchTab = function (tabName) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`panel-${tabName}`).classList.add('active');
    if (tabName === 'leads') loadLeads();
};

// ─── Load Leads ───
async function loadLeads() {
    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Failed to load leads:', error);
        return;
    }
    allLeads = data || [];
    updateLeadStats();
    renderLeads(allLeads);
    setupLeadFilters();
}

function updateLeadStats() {
    const hot = allLeads.filter(l => l.temperature === 'hot').length;
    const warm = allLeads.filter(l => l.temperature === 'warm').length;
    const cold = allLeads.filter(l => l.temperature === 'cold').length;
    const hotEl = document.getElementById('hotCount');
    const warmEl = document.getElementById('warmCount');
    const coldEl = document.getElementById('coldCount');
    if (hotEl) hotEl.textContent = hot;
    if (warmEl) warmEl.textContent = warm;
    if (coldEl) coldEl.textContent = cold;
}

// ─── Render Leads Table ───
function renderLeads(leads) {
    const tbody = document.getElementById('leads-table-body');
    const empty = document.getElementById('leadsTableEmpty');
    if (!tbody) return;

    if (leads.length === 0) {
        tbody.innerHTML = '';
        if (empty) empty.style.display = 'block';
        return;
    }
    if (empty) empty.style.display = 'none';

    tbody.innerHTML = leads.map(lead => {
        const name = `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unknown';
        const tempIcon = { hot: '🔥', warm: '🌡️', cold: '❄️' }[lead.temperature] || '🌡️';
        const tempClass = lead.temperature || 'warm';
        const stageLabel = (lead.stage || 'new').replace('_', ' ');
        const date = lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '—';
        const contact = lead.email || lead.phone || '—';

        return `<tr>
            <td data-label="Name"><strong>${name}</strong></td>
            <td data-label="Contact">${contact}</td>
            <td data-label="Interest">${lead.vehicle_interest || '—'}</td>
            <td data-label="Temperature"><span class="temp-badge ${tempClass}">${tempIcon} ${tempClass}</span></td>
            <td data-label="Stage"><span class="stage-pill">${stageLabel}</span></td>
            <td data-label="Date">${date}</td>
            <td data-label="Actions">
                <button class="action-btn btn-edit" onclick="openLeadDrawer('${lead.id}')">View</button>
            </td>
        </tr>`;
    }).join('');
}

// ─── Lead Filters ───
function setupLeadFilters() {
    const search = document.getElementById('leadSearchInput');
    const stage = document.getElementById('filterStage');
    const temp = document.getElementById('filterTemp');

    const apply = () => {
        let filtered = [...allLeads];
        const q = (search?.value || '').toLowerCase();
        if (q) {
            filtered = filtered.filter(l =>
                `${l.first_name} ${l.last_name}`.toLowerCase().includes(q) ||
                (l.email || '').toLowerCase().includes(q) ||
                (l.phone || '').includes(q)
            );
        }
        if (stage?.value) filtered = filtered.filter(l => l.stage === stage.value);
        if (temp?.value) filtered = filtered.filter(l => l.temperature === temp.value);
        renderLeads(filtered);
    };

    search?.addEventListener('input', apply);
    stage?.addEventListener('change', apply);
    temp?.addEventListener('change', apply);
}

// ─── Lead Drawer ───
window.openLeadDrawer = function (leadId) {
    const lead = allLeads.find(l => l.id === leadId);
    if (!lead) return;
    currentLeadId = leadId;

    const name = `${lead.first_name || ''} ${lead.last_name || ''}`.trim();
    document.getElementById('drawerName').textContent = name || 'Unknown';
    document.getElementById('drawerEmail').textContent = lead.email ? `✉️ ${lead.email}` : 'No email';
    document.getElementById('drawerPhone').textContent = lead.phone ? `📞 ${lead.phone}` : 'No phone';
    document.getElementById('drawerVehicle').textContent = lead.vehicle_interest || '—';
    document.getElementById('drawerBudget').textContent =
        lead.budget_low || lead.budget_high
            ? `$${(lead.budget_low || 0).toLocaleString()} – $${(lead.budget_high || 0).toLocaleString()}`
            : '—';
    document.getElementById('drawerTradeIn').textContent = lead.trade_in || 'No';
    document.getElementById('drawerNotes').textContent = lead.notes || 'No notes';
    document.getElementById('drawerStage').value = lead.stage || 'new';
    document.getElementById('drawerTemp').value = lead.temperature || 'warm';
    document.getElementById('similarResults').innerHTML = '';

    document.getElementById('leadDrawer').classList.add('open');
};

window.closeDrawer = function () {
    document.getElementById('leadDrawer').classList.remove('open');
    currentLeadId = null;
};

// ─── Update Lead Field ───
window.updateLeadField = async function (field, value) {
    if (!currentLeadId) return;
    const { error } = await supabase
        .from('leads')
        .update({ [field]: value })
        .eq('id', currentLeadId);

    if (error) {
        console.error(`Failed to update ${field}:`, error);
        return;
    }
    // Update local data
    const lead = allLeads.find(l => l.id === currentLeadId);
    if (lead) lead[field] = value;
    updateLeadStats();
    renderLeads(allLeads);
};

// ─── Find Similar Leads (Pinecone) ───
window.findSimilarLeads = async function () {
    const lead = allLeads.find(l => l.id === currentLeadId);
    if (!lead) return;

    const btn = document.getElementById('findSimilarBtn');
    const results = document.getElementById('similarResults');
    btn.textContent = 'Searching...';
    btn.disabled = true;

    try {
        const response = await fetch('https://fmcqefjxdpwtxskdhtgk.supabase.co/functions/v1/find-similar-leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: `${lead.first_name} ${lead.last_name}`,
                vehicle_interest: lead.vehicle_interest,
                budget_low: lead.budget_low,
                budget_high: lead.budget_high,
                temperature: lead.temperature
            })
        });
        const data = await response.json();

        if (data.matches && data.matches.length > 0) {
            results.innerHTML = data.matches
                .filter(m => m.id !== currentLeadId)
                .slice(0, 5)
                .map(m => `
                    <div class="similar-lead-card">
                        <strong>${m.metadata?.name || m.id}</strong>
                        <span class="similar-score">${Math.round((m.score || 0) * 100)}% match</span>
                    </div>
                `).join('') || '<p class="text-muted">No similar leads found</p>';
        } else {
            results.innerHTML = '<p class="text-muted">No similar leads found</p>';
        }
    } catch (err) {
        console.error('Similar leads error:', err);
        results.innerHTML = '<p class="text-muted">Could not reach AI service</p>';
    }

    btn.textContent = 'Find Similar';
    btn.disabled = false;
};
