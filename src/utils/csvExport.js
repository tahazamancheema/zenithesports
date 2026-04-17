import Papa from 'papaparse';

/**
 * Converts an array of registration objects to CSV and triggers download.
 * @param {Array<Object>} registrations
 * @param {string} filename
 */
export function exportRegistrationsToCSV(registrations, filename = 'zenith_registrations') {
  const rows = registrations.map((reg) => ({
    'Registration ID': reg.id,
    'Team Name': reg.team_name,
    'Real Name': reg.real_name || '—',
    'City': reg.city || '—',
    'WhatsApp': reg.whatsapp_number,
    'Player IDs': Array.isArray(reg.player_ids) ? reg.player_ids.join(' | ') : '',
    'Status': reg.status,
    'Group': reg.group_id || 'Unassigned',
    'Tournament ID': reg.tournament_id,
    'Registered At': reg.created_at
      ? new Date(reg.created_at).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })
      : '',
  }));

  const csv = Papa.unparse(rows);
  const blob = new Blob(["\ufeff", csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
