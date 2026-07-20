require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Menggunakan Environment Variables yang akan diisi oleh user
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SUPABASE_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

// Skrip migrasi sederhana untuk membuat tabel jika belum ada (Opsional untuk Supabase, biasanya dilakukan di Dashboard)
// Supabase JS tidak memiliki query raw sefleksibel SQLite untuk DDL (CREATE TABLE), 
// tapi pengguna sangat disarankan untuk menjalankan SQL di Dashboard Supabase mereka.

module.exports = supabase;
