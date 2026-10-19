# Salesforce Developer Evaluation (Papers A & B)

A static web test. It is plain HTML/CSS/JS with no server and no build step, and it is hosted free on GitHub Pages.

| Section | Format | Questions | Marks |
|---|---|---|---|
| A | Multiple choice | 15 × 2 | 30 |
| B | Short answer (3–5 lines) | 5 × 4 | 20 |
| C | Coding (Apex / LWC) | 5 × 6 | 30 |
| D | Scenario based | 5 × 4 | 20 |
| | **Total · 150 min · pass 60 %** | | **100** |

Paper A and Paper B share no questions. The source paper had only 8 coding and 6 scenario questions, so these items are reworked versions of originals:
- Paper B coding **R1**: Opportunity roll-up trigger, a remix of C1.
- Paper B coding **R2**: Case batch plus schedule, a remix of C2 and C3.
- Scenarios **XA4 / XA5 / XB4 / XB5**: remixes of D2, D6, D1 and D3.

## Candidate links
- Paper A: `https://<your-github-user>.github.io/<repo>/?paper=a`
- Paper B: `https://<your-github-user>.github.io/<repo>/?paper=b`
- Bare site URL: lists both papers with Copy-link buttons.

## Rules enforced during the test
- **Full screen only.** The test starts in full screen. Leaving full screen (Esc) counts as leaving the page.
- **Page swaps.** Switching tab or window, minimising, exiting full screen, or reloading the page each count as one swap. Swaps 1 and 2 show a warning. **The 3rd swap terminates the test.** Answers given so far are submitted with status **TERMINATED**, and the student sees a termination screen listing each swap with its time.
- **No copy/paste.** Copy, cut, paste, drag-drop, right-click, print and the related shortcuts (Ctrl/Cmd + C/X/V/P/S/U, Shift+Insert) are blocked on the test page, in both directions.
- **Autosave and auto-submit.** Answers save automatically, and the test submits itself when time runs out.

## Results
- **Marking:** MCQs are marked exactly. Sections B–D get a **provisional** score from the key points in the answer key. The report shows which points were found or missing, plus the candidate's answer and the model answer, so the organizer can review it.
- **Email:** the result is emailed to the organizer through EmailJS (same keys as the existing evaluation), with every answer in the email body.
- **On-screen report:** after a submission, *Organizer: view results* (passcode `organizerPasscode` in `config.js`) opens the full report on the candidate's machine. It can be downloaded as PDF or re-sent.

## Upload to GitHub
1. On github.com, click **New repository**. Name it, e.g. `Salesforce-Evaluation`, set it to **Public**, tick *Add a README*, then **Create**.
2. Click **Add file → Upload files**. Drag in **all the files from the zip**. They all sit at the top level, with no folders. Click **Commit changes**.
3. Go to **Settings → Pages**. Set Source: *Deploy from a branch*, Branch: `main`, folder `/ (root)`, then **Save**.
4. After about 1 minute the site is live at `https://<your-github-user>.github.io/Salesforce-Evaluation/`.

## Editing
- **Rules:** `config.js` holds pass mark, time, marks, max swaps, passcode, email and EmailJS keys.
- **Questions:** `questions.js` holds the question bank, answer key, rubric points and paper composition.

## Limits
A web page cannot stop a second device, a phone camera, or OS-level screenshot tools. Use invigilation for high-stakes tests. Mobile browsers (especially iPhone Safari) do not support full screen, so candidates need a laptop or desktop with Chrome, Edge or Firefox.
