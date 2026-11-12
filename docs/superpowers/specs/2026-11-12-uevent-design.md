# uEvent Design Spec

Date: 2026-11-12
Status: agreed with the project owner in a design interview on 2026-11-12.

## 1. Purpose

uEvent is an event management system for the university whose email domain is `utp.edu.my`. Clubs and societies submit event proposals, the Student Representative Council (SRC) reviews them, and approved events appear on a public page.

It solves four problems, in this priority order:

1. Event approval is slow and paper-based.
2. The SRC has no overview of what clubs are doing.
3. Students don't know what events are happening.
4. Registration is messy. The first version only links out to the club's own sign-up form.

The goal is a real system the campus runs, not a demo.

## 2. Users

| User | Account | What they do |
|---|---|---|
| SRC admin | Yes | Create clubs, invite presidents, decide on proposals, verify letters, decide change requests, see the overview. All SRC admins have equal powers. |
| Club president | Yes | Manage their committee, submit proposals, delegate submission, transfer the president role. |
| Club committee member | Yes | Draft and edit proposals, upload documents, file reports. |
| Student | No | Browse the public event page. |
| Club advisor, Student Affairs | No | Approve offline. The club uploads proof. |

About 50 to 100 clubs.

## 3. Approval flow

The real-world order is advisor, then SRC, then Student Affairs.

1. Any committee member creates and edits a draft.
2. Only the president, or a member the president has delegated, submits it. The advisor's signed form must be attached before submission.
3. An SRC admin does one of:
   - approve;
   - return it with a comment, after which the club edits and resubmits;
   - reject it with a comment, which is final.
4. After SRC approval the club uploads the Student Affairs approval letter.
5. An SRC admin verifies the letter. If it is wrong, the admin rejects the letter with a comment and the club uploads again.
6. The event is then approved and published.

Every status change is recorded with who did it, when, and any comment.

### Statuses

| Status | Meaning |
|---|---|
| `draft` | Being written by the club. |
| `submitted` | Waiting for the SRC. |
| `returned` | Sent back by the SRC with comments. |
| `rejected` | Rejected by the SRC. Final. |
| `awaiting_sa_letter` | SRC approved; club must upload the Student Affairs letter. |
| `verifying_sa_letter` | Letter uploaded; waiting for the SRC to verify it. |
| `approved` | Fully approved and public. |
| `cancelled` | Cancelled through an approved cancellation request. |

### Transitions

| From | Action | To | Who | Comment |
|---|---|---|---|---|
| `draft`, `returned` | `submit` | `submitted` | President or delegate | Optional |
| `submitted` | `approve` | `awaiting_sa_letter` | SRC admin | Optional |
| `submitted` | `return` | `returned` | SRC admin | Required |
| `submitted` | `reject` | `rejected` | SRC admin | Required |
| `awaiting_sa_letter` | `upload_sa_letter` | `verifying_sa_letter` | Any club member | Optional |
| `verifying_sa_letter` | `verify_sa_letter` | `approved` | SRC admin | Optional |
| `verifying_sa_letter` | `reject_sa_letter` | `awaiting_sa_letter` | SRC admin | Required |
| `approved` | `cancel` | `cancelled` | SRC admin, by approving a cancellation request | Optional |

## 4. Proposal contents

- Title, description, start and end date-time, venue, expected number of participants.
- Budget: a list of lines, each income or expense, with a label and an amount in RM. The SRC reads it; the system does not track funding or payments.
- Attachments: proposal paper, advisor's signed form (required to submit), other documents.
- Poster image and an optional external sign-up link. These are shown publicly once the event is approved.

## 5. Rules

- **Notice period:** a proposal submitted less than 3 days before the event start is accepted, but the club sees a warning and the proposal is flagged as late to the SRC.
- **Changes after approval:** changing the start, end or venue of an approved event, or cancelling it, needs a change request that an SRC admin approves or rejects. Title, description, poster and sign-up link can be edited directly.
- **Post-event report:** due within 14 days after the event ends. It contains a summary, actual attendance, actual spending and photos.
- **Block:** a club with an overdue report cannot submit proposals until the report is filed. It can still draft.
- The 3 and 14 are settings an SRC admin can change.

## 6. Clubs and accounts

- An SRC admin creates a club and invites its president by university email.
- The president invites and removes committee members, delegates submission rights, and transfers the president role at handover. An SRC admin can also transfer the president role.
- A club always has exactly one president.
- SRC admins are added by an existing SRC admin. The first one is named in configuration.

## 7. Sign-in

- Primary: Microsoft sign-in.
- Fallback, if university IT does not allow the app: email and password.
- In both modes only `@utp.edu.my` addresses can have accounts. The check is on the domain only, not on the `name_studentID` pattern.

## 8. Public page

- Lists approved, upcoming events: poster, title, description, date, venue, club, sign-up link.
- No login. Budget, attachments and history are never public.

## 9. SRC overview

- **Queue:** proposals to decide, letters to verify and change requests, each with how long it has waited and a late-notice flag.
- **Activity per club:** events per club per semester, by status.
- **Overdue reports:** clubs with overdue reports, which are the blocked clubs.

## 10. Notifications

Email to the university address plus an in-app list, sent when something needs a person's attention:

- to SRC admins: proposal submitted, letter uploaded, change request made;
- to the club's members: proposal approved, returned or rejected; letter verified or rejected; change request decided; report due soon and overdue.

## 11. Technology

- Responsive web app, English only.
- Next.js and Supabase (Postgres, sign-in, file storage), TypeScript throughout.
- Paid hosting, funded by the team or the SRC.
- Times shown in Malaysia time. Money in RM.

## 12. Out of scope for the first version

Student accounts, in-system registration and attendance, staff accounts, venue booking, funding and payment tracking, Excel export, chat-app notifications, a mobile app, other languages, other universities.

## 13. Rollout

1. Build the proposal and SRC review flow first and demo it to the SRC contact.
2. Finish the rest of the first version.
3. Pilot with 3 to 5 clubs for one semester.

Success: the pilot clubs submit every proposal through uEvent for a semester, and the SRC decides on them there.

Team: 3 to 4 developers. No fixed deadline.
