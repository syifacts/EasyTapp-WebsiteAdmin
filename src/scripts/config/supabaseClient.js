import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://oteebvgtsvgrkfooinrv.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90ZWVidmd0c3Zncmtmb29pbnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNDU1NzQsImV4cCI6MjA1ODYyMTU3NH0.IE1UReAZZk-9fbqi8SV3EF86Py703eoJVvpEBbzCBAo';  // Ganti dengan Anon Key Anda
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
