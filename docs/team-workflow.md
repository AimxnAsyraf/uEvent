# uEvent Team Workflow

Date: 2026-11-12

How four developers build uEvent together: who builds what, how work moves from one person to the next, and what "done" means.

Read this with:

- `docs/design-spec.md`: what uEvent does.
- `docs/implementation-plan.md`: the 15 build tasks, each with its files, interfaces and tests. "Task 7" below means Task 7 in that plan.

## 1. Team

| Name here | Role | Notes |
|---|---|---|
| Lead | Most experienced. Owns the foundation, sign-in and the review flow. Reviews pull requests. | |
| Dev B | Feature owner | |
| Dev C | Feature owner | |
| Dev D | Feature owner | |

- Everyone gives about 5 to 10 hours a week, around classes.
- Each developer owns whole tasks, from database to screen. Nobody is "the frontend person".
- Replace the placeholders above with real names.

## 2. Build plan

### Who builds what

| Phase | Lead | Dev B | Dev C | Dev D |
|---|---|---|---|---|
| 0. Foundation | Task 1 (scaffold), Task 2 (database), Task 2B (Netlify previews) | Set up, read the spec and plan | Same | Same |
| 1. Towards the SRC demo | Task 5 (sign-in), then Task 9 (submission and review) | Task 3 (status rules), Task 4 (timing rules), then Task 7 (drafting and uploads) | Task 8 (notifications), then Task 6 (clubs) | Task 11 (public page), then Task 14 (SRC overview) |
| 2. Complete first version | Task 12 (change requests) | Task 10 (Student Affairs letter) | Task 13 (reports and reminders) | Finish Task 14, then the full-flow test (Task 15, Steps 1 and 2) |
| 3. Pilot | Task 15 (deployment, Microsoft sign-in) | Pilot guide for clubs | Pilot guide for the SRC | Production check on a phone, pilot support |

Why this split:

- The Lead takes the tasks everything else depends on.
- Tasks 3 and 4 are pure rules with no database, and the plan spells out every test. They are the best first tasks for someone new to the stack.
- Tasks 8, 11 and 14 depend only on the foundation, so Dev C and Dev D are never waiting on the demo's critical path.

### What each task waits for

A task can start only when the tasks it waits for are merged into `main`.

| Task | Waits for |
|---|---|
| 1 Scaffold | nothing |
| 2 Database | 1 |
| 2B Netlify previews | 2 |
| 3 Status rules | 1 |
| 4 Timing rules | 2, 3 |
| 5 Sign-in | 2, 3 |
| 6 Clubs | 5 |
| 7 Drafting and uploads | 3, 5 |
| 8 Notifications | 2 |
| 9 Submission and review | 4, 5, 7, 8 |
| 10 Student Affairs letter | 7, 8, 9 |
| 11 Public page | 2 |
| 12 Change requests | 4, 8, 9 |
| 13 Reports and reminders | 4, 7, 8, 9 |
| 14 SRC overview | 4, 5 |
| 15 Deployment | all |

The critical path to the demo is 1 → 2 → 5 → 7 → 9. If any of those slips, the demo slips; raise it at the sync straight away.

### Checkpoints

| Checkpoint | When | What happens |
|---|---|---|
| Foundation ready | Tasks 1, 2 and 2B merged | Everyone runs the app and the tests locally before taking a task. Every pull request now gets a Netlify preview link. |
| SRC demo | Task 9 merged | Demo the flow to the SRC contact on the staging site, so they can try it on their own phone. Record their feedback as cards before Phase 2. |
| Feature complete | Tasks 10 to 14 merged | The full-flow test passes. |
| Pilot start | Task 15 done | 3 to 5 clubs start using it. |

There are no dates, because there is no deadline. Set a target date for the SRC demo at the first sync and revisit it weekly.

## 3. Task board (Notion)

One card per plan task, 16 cards to start (Tasks 1 to 15 plus Task 2B).

Columns:

| Column | Meaning |
|---|---|
| Backlog | Waiting for other tasks. |
| Ready | Everything it waits for is merged. Can be picked up. |
| In progress | Someone is working on it. A branch exists. |
| In review | A pull request is open and ready for review. |
| Done | Merged into `main`. |

Each card has:

- **Owner**
- **Plan link:** the task's heading in `docs/implementation-plan.md`
- **Waits for:** the task numbers from the table above
- **Pull request:** the GitHub link
- **Updates:** short dated notes, newest first

Rules:

- One person owns a card. One card In progress per person.
- Bugs and SRC feedback get their own cards. Anyone can add one.
- Update the card whenever you stop work for the day, even with one line.

## 4. Working on a task

1. Move the card to In progress.
2. Update `main`, then create a branch named `task-<number>-<short-name>`, for example `task-07-drafting`.
3. Follow the task's steps in order. Write the test first, watch it fail, then write the code.
4. Push at least once per working session, even if unfinished. Open a draft pull request on the first push.
5. When the task's tests pass, click through the feature yourself in the browser, locally and on the Netlify deploy preview link that Netlify posts on the pull request.
6. Mark the pull request ready, move the card to In review, and post the link in the team chat.
7. After approval, squash and merge, delete the branch, and move the card to Done.

### Definition of done

- Every step of the plan task is ticked.
- `npm run lint`, `npm run typecheck`, `npm test` and `npm run test:int` pass locally, and CI is green.
- The author has used the feature in the browser, including on the deploy preview.
- The pull request is approved.
- No interface in the plan was changed without following section 6.

### Pull requests

- One task, one pull request. If a pull request passes about 600 changed lines, split it at a natural point in the task's steps.
- `main` is protected: no direct pushes, CI must pass, one approval needed.
- Use the template in `.github/pull_request_template.md`.

## 5. Review

| Phase | Who reviews |
|---|---|
| 0 and 1 | The Lead reviews every pull request. Another developer reviews the Lead's. |
| 2 and 3 | Any developer can review. The Lead must also review anything touching sign-in, permissions, uploads or database migrations. |

- Review within 2 days. If you can't, say so and someone else takes it.
- A reviewer opens the deploy preview and tries the feature, then checks: the tests match the plan, the code does what the task says, permissions are checked on the server, and nothing outside the task changed.
- Comments are about the code, not the person. Mark a comment "must fix" or "suggestion".
- The author fixes "must fix" comments and replies to every comment.

## 6. Shared contracts

The "Interfaces" block in each plan task lists the function names, types and table columns other tasks rely on. These are the contract between developers.

- Build exactly the names and types the plan gives.
- If one has to change, post in the team chat first, then change the plan in the same pull request as the code.
- Database changes go in a new numbered migration file. Never edit a merged migration. Tell the team before merging a migration, because numbers can collide.
- Deploy previews share one staging database. After a migration merges, the Lead applies it to staging (see `docs/deployment.md`). Until then, previews of that pull request run against the old schema; say so in the pull request.

## 7. Using AI assistants

Some of the team use an AI coding assistant and some write by hand. Both are fine. The same rules apply to everyone:

- The author is responsible for the code, whoever typed it.
- The author must be able to explain every line in review. If you can't, don't open the pull request yet.
- The plan's tests come first. Don't let an assistant change a test to make it pass.
- Say in the pull request whether AI was used and for which parts.
- Never paste keys, passwords or real student data into an assistant.

For developers new to the stack: write Tasks 3 and 4 by hand, even if you use AI later. They are small and teach the project's patterns.

## 8. Communication

**Weekly sync, 30 minutes:**

1. Each person demos what they merged (2 minutes each).
2. Each person names what blocks them.
3. Check the critical path and the demo target date.
4. Each person says which card they take next.

The Lead writes the decisions in the team chat afterwards.

**Between syncs:**

- Stuck for more than an hour: post in the team chat with what you tried.
- Away for more than a few days (exams, travel): say so before you go, and hand off any card In progress.
- A card In progress with no update for a week is raised at the sync and can be reassigned.

## 9. Handing off a task

Hand off when you can't finish a card soon: exams, illness, or a swap agreed at the sync.

1. Push everything, including unfinished work.
2. Make sure a draft pull request exists.
3. Write a handoff note on the Notion card using the template below.
4. Tell the next owner in the team chat and change the card's owner.

The next owner reads the note, runs the branch locally, and asks questions within 2 days while the details are fresh.

### Handoff note template

```
Handoff: Task <number> <name>
From / to:
Date:
Branch and pull request:

Done (plan steps ticked):
Left (plan steps not done):
State of the tests: (which pass, which fail, and why)
How to run it: (anything beyond the README)
Decisions I made that the plan doesn't cover:
Known problems or things I was unsure about:
```

A finished task needs no note: the merged pull request and the plan are the record.

## 10. First week

| Who | What |
|---|---|
| Lead | Create the Notion board with a card per task (16, including Task 2B). Protect `main`. Complete Tasks 1, 2 and 2B. |
| Everyone else | Install Node.js 22 and Docker. Read `docs/design-spec.md` and the plan's opening sections. Once Task 2 is merged, run the app and the tests locally. |
| All | First sync: put names in section 1, agree the chat channel and sync time, set a target date for the SRC demo. |
