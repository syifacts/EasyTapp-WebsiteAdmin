import supabase from '../config/supabaseClient';

export const getAllEmployees = async () => {
  const { data, error } = await supabase.from('employees').select('*');
  if (error) {
    console.error('Gagal mengambil data karyawan:', error.message);
    return [];
  }
  return data;
};
