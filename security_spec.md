# Vittaconect 2.0 — Security Architecture & Firestore Specification (`security_spec.md`)

## 1. Data Invariants & RBAC Model

1. **Zero-Trust Default Deny**: Every unmatched path in `/databases/{database}/documents/{document=**}` defaults to `allow read, write: if false;`. No collection permits `allow read, write: if true;`.
2. **Role-Based Access Control (RBAC)**:
   - `paciente`: Can only read/write their own `/users/{userId}` document (`request.auth.uid == userId`), read/write their own appointments, and read/write chat messages where they are a verified participant.
   - `profissional`: Verified via `/users/$(request.auth.uid).data.role == 'profissional'`. Authorized to read/manage clinical records, triage queues, professional schedules, and 1-on-1 patient-nurse chat channels.
   - `administrador`: Bootstrapped admin (`ronaldmendesmendes23z@gmail.com` with `email_verified == true` or document in `/admins/{uid}`).
3. **PII & Clinical Record Isolation**:
   - Clinical records (`/clinical_records/{recordId}`) and SOAP evolutions are strictly restricted to the owning patient (`resource.data.patientId == request.auth.uid`) or authenticated clinical professionals (`isProfessional()`) or admins (`isAdmin()`).
   - Once a SOAP evolution or clinical record reaches `status == 'finalizado'`, clinical content fields become immutable (`Terminal State Locking`).
4. **Audit Trail**:
   - Sensitive operations record immutable entries in `/audit_logs/{auditId}` (`allow update, delete: if false;`).

## 2. The "Dirty Dozen" Adversarial Payloads (Rejected by `firestore.rules`)

1. **Unauthenticated Profile Scrape**: `auth = null`, `get /users/user_123` -> `PERMISSION_DENIED`.
2. **Cross-Patient Clinical Snooping**: `auth.uid = 'pat_A'`, `get /users/pat_B` -> `PERMISSION_DENIED`.
3. **Privilege Escalation on Profile Update**: `auth.uid = 'pat_A'`, `update /users/pat_A` with `{ role: 'administrador' }` -> `PERMISSION_DENIED` (`role` is immutable for non-admins).
4. **Shadow Field Injection**: `auth.uid = 'pat_A'`, `create /users/pat_A` with `{ isSuperAdmin: true }` -> `PERMISSION_DENIED` (`hasOnly` key allowlist).
5. **ID Poisoning Attack**: `create /users/{200_char_malicious_id}` -> `PERMISSION_DENIED` (`isValidId` regex & length<=128).
6. **Denial-of-Wallet Oversized Payload**: `create /consultation_chats/c1/messages/m1` with `text` of 50,000 chars -> `PERMISSION_DENIED` (`text.size() <= 4000`).
7. **Spoofed Sender UID in Chat**: `auth.uid = 'pat_A'`, `create message` with `{ senderId: 'prof_marcelo' }` -> `PERMISSION_DENIED`.
8. **Silent Tampering of Finalized SOAP Record**: `update /clinical_records/rec_1` when `resource.data.status == 'finalizado'` -> `PERMISSION_DENIED`.
9. **Audit Log Deletion / Tampering**: `delete /audit_logs/log_1` -> `PERMISSION_DENIED`.
10. **Unverified Email Admin Spoof**: `auth.token.email == 'ronaldmendesmendes23z@gmail.com'` with `email_verified == false` -> `PERMISSION_DENIED`.
11. **Unauthorized Agenda Deletion by Patient**: `auth.uid = 'pat_A'`, `delete /professional_agenda/apt_1` -> `PERMISSION_DENIED`.
12. **Blanket List Query without Ownership Filter**: `auth.uid = 'pat_A'`, `list /clinical_records` without `where('patientId', '==', 'pat_A')` -> `PERMISSION_DENIED`.
