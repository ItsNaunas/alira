# Database Schema Change Log

**Purpose**: Track all database schema changes to maintain synchronization between code and database.

---

## 📅 October 19, 2025

### Initial Schema Capture
- **Action**: Captured current production database schema
- **File**: `CURRENT_DATABASE_SCHEMA.sql`
- **Purpose**: Establish baseline for future reference and debugging

### Key Schema Details:
- **Tables**: 9 main tables (business_cases, dashboards, email_notifications, events, generations, intake_forms, leads, profiles, transactions)
- **Critical Column**: `generations.version` (integer) - NOT `version_number`
- **Relationships**: Proper foreign key constraints between dashboards, generations, and auth.users

---

## 🔄 How to Use This Log

### When Making Database Changes:
1. **Before**: Document what you're changing and why
2. **During**: Make the change in Supabase
3. **After**: Update `CURRENT_DATABASE_SCHEMA.sql` with the new structure
4. **Update**: This change log with the details

### When Debugging Issues:
1. **Check**: `CURRENT_DATABASE_SCHEMA.sql` to see what the database actually looks like
2. **Compare**: With your code expectations
3. **Identify**: Any mismatches or missing columns/tables

---

## 📋 Schema Maintenance Checklist

### Before Making Changes:
- [ ] Document the change in this log
- [ ] Test changes on staging if possible
- [ ] Ensure foreign key relationships are maintained

### After Making Changes:
- [ ] Update `CURRENT_DATABASE_SCHEMA.sql` with new structure
- [ ] Update this change log with details
- [ ] Test application functionality
- [ ] Update any affected code if needed

### When Adding New Tables:
- [ ] Include proper UUID primary keys
- [ ] Add created_at timestamps
- [ ] Set up appropriate foreign key constraints
- [ ] Consider RLS policies if needed
- [ ] Update schema documentation

### When Adding New Columns:
- [ ] Check for nullable vs required
- [ ] Set appropriate default values
- [ ] Update any affected queries in code
- [ ] Consider impact on existing data

---

## 🚨 Common Issues to Watch For

### Column Name Mismatches:
- Code expects `version_number` but database has `version`
- Code expects `user_id` but database has `user_uuid`
- Case sensitivity issues (PostgreSQL is case-sensitive)

### Missing Columns:
- Code tries to insert/select columns that don't exist
- Foreign key columns missing
- Required fields without defaults

### Data Type Mismatches:
- Code expects string but database has integer
- JSON vs JSONB differences
- Array types vs JSON arrays

---

## 📞 How to Get Current Schema

### From Supabase Dashboard:
1. Go to Supabase Dashboard → Your Project
2. Go to SQL Editor
3. Run this query:
```sql
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
```

### From Command Line (if you have psql access):
```bash
pg_dump -h your-host -U your-user -d your-database --schema-only --no-owner --no-privileges
```

---

## 📝 Template for New Changes

```markdown
## 📅 [Date]

### [Change Description]
- **Action**: [What was changed]
- **Reason**: [Why the change was needed]
- **Impact**: [What code might be affected]
- **Files Updated**: [List of files that were modified]

### Schema Changes:
- **Tables Modified**: [List tables]
- **Columns Added**: [List new columns]
- **Columns Removed**: [List removed columns]
- **Columns Modified**: [List modified columns]
- **Relationships**: [Any FK changes]

### Testing:
- [ ] Schema change applied successfully
- [ ] Application still works
- [ ] No breaking changes to existing functionality
- [ ] New features work as expected
```

---

**Remember**: Always keep this schema documentation up to date to avoid future debugging headaches! 🎯
