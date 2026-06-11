# Datenmodell

## Rollen

- `student`: sieht Termine, Aufgaben, Ressourcen und Ankündigungen; nimmt an Abstimmungen teil.
- `class_representative`: zusätzlich Abstimmungen und Ankündigungen erstellen, Termine vorschlagen, Infos pinnen.
- `teacher`: Termine, Aufgaben und Ankündigungen erstellen; Abstimmungen sehen.
- `admin`: Klasse und Mitglieder verwalten, Rollen vergeben.

## Tabellen

### profiles

Öffentliches Nutzerprofil zur Supabase-Auth-ID.

- `id`
- `email`
- `full_name`
- `avatar_url`
- `created_at`
- `updated_at`

### classes

- `id`
- `name`
- `school`
- `school_year`
- `invitation_code`
- `created_by`
- `created_at`
- `updated_at`

### class_members

- `id`
- `class_id`
- `user_id`
- `role`
- `joined_at`

### invitations

- `id`
- `class_id`
- `code`
- `active`
- `expires_at`
- `max_uses`
- `used_count`
- `created_by`
- `created_at`

### subjects

- `id`
- `class_id`
- `name`
- `color`
- `teacher_name`
- `created_at`

### events

- `id`
- `class_id`
- `title`
- `type`: `exam`, `deadline`, `lesson`, `project`, `other`
- `date`
- `time`
- `subject`
- `room`
- `description`
- `priority`: `low`, `medium`, `high`
- `status`: `planned`, `soon`, `done`, `missed`
- `created_by`
- `created_at`
- `updated_at`

### assignments

- `id`
- `class_id`
- `title`
- `subject`
- `description`
- `due_date`
- `priority`
- `status`: `open`, `in_progress`, `done`, `overdue`
- `assigned_to`
- `created_by`
- `created_at`
- `updated_at`

Regel: Wenn `due_date` in der Vergangenheit liegt und `status != done`, berechnet die App `overdue`.

### resources

- `id`
- `class_id`
- `title`
- `subject`
- `type`: `file`, `link`, `note`
- `url`
- `description`
- `tags`
- `uploaded_by`
- `created_at`

MVP: Links und Metadaten. Supabase Storage ist vorbereitet, aber keine Fake-Uploads.

### announcements

- `id`
- `class_id`
- `title`
- `content`
- `importance`: `normal`, `important`, `urgent`
- `pinned`
- `valid_until`
- `created_by`
- `created_at`

### polls

- `id`
- `class_id`
- `title`
- `description`
- `type`: `yes_no`, `single_choice`, `multiple_choice`, `rating`, `date_finding`
- `options`
- `starts_at`
- `ends_at`
- `anonymous`
- `multiple_choice`
- `result_visibility`: `immediate`, `after_end`, `admins_only`
- `status`: `planned`, `active`, `ended`
- `created_by`
- `created_at`
- `updated_at`

### poll_options

- `id`
- `poll_id`
- `label`
- `sort_order`
- `created_at`

### poll_votes

- `id`
- `poll_id`
- `user_id`
- `selected_option_ids`
- `rating_value`
- `created_at`
- `updated_at`

### notifications

- `id`
- `class_id`
- `user_id`
- `type`
- `title`
- `body`
- `read_at`
- `created_at`
