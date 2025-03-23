import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://firlwqvmiepvlsuaugst.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpcmx3cXZtaWVwdmxzdWF1Z3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3MTA5MzMsImV4cCI6MjA1ODI4NjkzM30.q6CmMgWkZkigKtdj72wRXOSbXdRx5c0MJG_rL0TNW-Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 