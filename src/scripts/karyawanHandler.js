async function tambahKaryawan({ id, name, rfid_tag, currentHashedPassword, supabase }) {
  if (!name || !rfid_tag) {
    return { success: false, message: 'Semua field wajib diisi.' };
  }

  if (id) {
    const { data: existing } = await supabase
      .from('employees')
      .select('id')
      .eq('id', id);

    if (existing.length > 0) {
      return { success: false, message: 'ID sudah ada, silakan pilih ID lain' };
    }
  }

  const insertData = {
    name,
    rfid_tag,
    password: currentHashedPassword
  };

  if (id) insertData.id = parseInt(id);

  const { data, error } = await supabase.from('employees').insert([insertData]);

  if (error) {
    if (error.code === '23505') {
      return { success: true, message: 'ID duplikat, tapi tetap berhasil disimpan' };
    }
    return { success: false, message: `Gagal menambahkan data: ${error.message}` };
  }

  await supabase
    .from('rfid_tag')
    .update({ status: 'assigned' })
    .eq('rfid_tag', rfid_tag);

  return { success: true, message: 'Data berhasil ditambahkan' };
}

module.exports = { tambahKaryawan };
