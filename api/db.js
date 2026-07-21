const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

// Menggunakan Environment Variables yang akan diisi oleh user
const supabaseUrl = process.env.SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key';

const supabase = createClient(supabaseUrl, supabaseKey);

// Skrip migrasi sederhana untuk membuat tabel jika belum ada (Opsional untuk Supabase, biasanya dilakukan di Dashboard)
// Supabase JS tidak memiliki query raw sefleksibel SQLite untuk DDL (CREATE TABLE), 
// tapi pengguna sangat disarankan untuk menjalankan SQL di Dashboard Supabase mereka.

module.exports = supabase;
