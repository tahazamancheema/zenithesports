import * as XLSX from 'xlsx';

/**
 * Converts an array of registration objects to XLSX and triggers download.
 * @param {Array<Object>} registrations
 * @param {string} filename
 */
export function exportRegistrationsToXLSX(registrations, filename = 'zenith_registrations') {
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

  // Create a new workbook and add the worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

  // Generate buffer and trigger download
  XLSX.writeFile(workbook, `${filename}_${Date.now()}.xlsx`);
}
