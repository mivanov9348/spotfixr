// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hzmdqvpfovdmjopfttwn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6bWRxdnBmb3ZkbWpvcGZ0dHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NTUwMDAsImV4cCI6MjA2NTEzMTAwMH0.doqhylHyqbxX-ld5CAstamP_zhjP_-3axSbUNEUsQt0'

export const supabase = createClient(supabaseUrl, supabaseKey)
