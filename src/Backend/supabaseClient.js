// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Ersetze diese Werte mit deinen aus dem Supabase-Dashboard
const supabaseUrl = 'https://dcuvcildgpltgchthddk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjdXZjaWxkZ3BsdGdjaHRoZGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MTI0MTYsImV4cCI6MjA2OTQ4ODQxNn0.Nc5dijbXHydpIATWwhquApxwNIt43dSZbeH0c7ynino'

export const supabase = createClient(supabaseUrl, supabaseKey)