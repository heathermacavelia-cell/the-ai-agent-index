/**
 * Independent Agent Tests (2026-11-10). One record per tested agent, keyed by slug.
 * The report page is /agents/[slug]/test and the listing hero shows a short strip
 * that links to it. Plain data, no database: a test is a dated, finished document.
 *
 * Rules for every record (Heather 2026-11-09/10):
 * - Same published task list for every agent of the same type (method below).
 * - A failed task gets ONE second try in a fresh session; the better run is scored
 *   and both runs are shown.
 * - A test never changes the agent's rating.
 * - sponsor is null when nobody paid. When a vendor pays, set sponsor and the page
 *   shows "The vendor paid for this test and saw our findings before publication."
 */

export type TaskResult = 'pass' | 'partial' | 'fail' | 'not-scored'

export interface TestRun {
  label: string // "First run (Nov 10)" etc.
  result: TaskResult
  text: string[] // paragraphs
}

export interface TestTask {
  n: number
  question: string // H3, question style
  name: string // short name for the table
  prompt: string | null // typed verbatim; null when the task has no prompt
  result: TaskResult // the scored (better) run
  corrections: number | null
  manualSteps: number | null
  minutes: string | null
  summary: string // one sentence, shown first
  runs: TestRun[]
  whyItMatters?: string
}

export interface AgentTest {
  slug: string
  agentName: string
  agentType: string // e.g. "workflow builder"
  testedOn: string // human date range
  publishedOn: string // ISO date
  plan: string
  aiBuilder: string
  sponsor: string | null
  score: { passed: number; partial: number; failed: number; of: number }
  headline: string // one line for the hero strip
  verdict: string[] // opening paragraphs
  strengths: string[]
  struggles: string[]
  buyerNotes: string[]
  tasks: TestTask[]
  planCheck: string[]
  howWeTested: string[]
  fixtures: { subject: string; body: string; note: string }[]
}

const ZAPIER: AgentTest = {
  slug: 'zapier',
  agentName: 'Zapier',
  agentType: 'workflow builder',
  testedOn: 'November 9 to 10, 2026',
  publishedOn: '2026-11-10',
  plan: 'Zapier Professional, 14-day free trial (what a new sign-up gets)',
  aiBuilder: 'Zapier Copilot, in the Zap editor and on the Zapier home page',
  sponsor: null,
  score: { passed: 7, partial: 0, failed: 2, of: 9 },
  headline: 'Built a working invoice workflow from plain English in minutes. Struggled with a daily digest email.',
  verdict: [
    'From one plain-English sentence, Zapier Copilot built a live, filtered Gmail-to-Google-Sheets workflow in about six minutes, then extended it step by step: it pulled amounts and due dates out of three different formats, added an AI summary, branched on invoice size, labelled each email in Gmail and repaired the workflow after we broke its spreadsheet. It passed 7 of the 9 tasks.',
    'The two tasks it did not complete were a scheduled digest that emails one list of yesterday\'s rows (it could not combine several rows in one email across two sessions) and an invoice with no amount, which was logged as a blank row with no warning. Two other tasks failed on the first try and passed on the second, so we show both runs.',
  ],
  strengths: [
    'From one sentence to a working, filtered workflow in about six minutes. Copilot found the right spreadsheet by name, added a sender and subject filter on its own, matched a lowercase "invoice" and correctly skipped a non-invoice email.',
    'Read money and dates in every format we sent: "USD 2,350", "$480.00", the European "1.200,00 EUR", "12/15/2026", "November 30, 2026" and "5 December 2026".',
    'Thought ahead without being asked: it added a numeric copy of the invoice amount so the "over $1,000" rule compares numbers, not text.',
    'Edited the existing workflow when asked instead of building a new one, and on the second try reused the Gmail label that already existed.',
    'Caught and fixed its own mistake: on the second try it noticed that a blank company name led the web search to government sites and rewrote its instruction so the Website column stays empty unless a result clearly belongs to the company.',
    'Diagnosed and repaired a broken spreadsheet connection ("worksheet not found"), re-pointed the step and re-checked all seven column mappings.',
    'Robust to everyday edits: renaming a column header or renaming the sheet tab did not break the workflow.',
    'Asked before every test that would send an email or write a row.',
  ],
  struggles: [
    'Daily digest email (task 7): in two sessions (about 50 and 20 minutes) it tried Digest by Zapier, Formatter, Code by Zapier and a spreadsheet lookup but never produced one email listing several rows.',
    'Missing data was not flagged (task 5): an invoice email with no amount became a row with blank Amount and Due date, with no alert or marker.',
    'Explaining a failure needed one nudge (task 8): its first answer described older runs, with times shown in UTC, before it found the real problem.',
    'A broken spreadsheet stops the step quietly. Zapier marked the run "safely halted" and sent no alert, while the later steps still ran.',
    'First tries can differ a lot from second tries on the same prompt: the Gmail label (task 6) and the website lookup (task 9) both failed on the first run and passed on the second.',
    'It sometimes stopped mid-build and needed a "please continue" (twice in the first run).',
  ],
  buyerNotes: [
    'Gmail drafts can trigger a "New Email" workflow. In our first run, three emails that were saved as drafts but never sent were logged as rows. It did not happen in the second run.',
    'Alert emails come from a Zapier no-reply address. Gmail filed one of our two alert threads as spam, so mark them "Not spam" early.',
    'Task usage adds up. The finished 11-step workflow used about 10 Zapier tasks per invoice email, because each AI step, web search and action counts.',
    'Clearing Copilot\'s chat removed a field value Copilot had just set in that chat (we saw this twice with the Gmail message field). Re-open your steps after clearing the chat. We did not count this against Zapier.',
    'Copilot cannot publish a workflow or pick a sample email for you. It hands those clicks back to you, which we counted as manual steps, not corrections.',
  ],
  tasks: [
    {
      n: 1,
      question: 'Can Zapier Copilot build a workflow from one sentence?',
      name: 'Build from one sentence',
      prompt: 'When a new email arrives from my own address with \'invoice\' in the subject, add the sender, subject and date to my AAI Test - Invoices sheet.',
      result: 'pass',
      corrections: 0,
      manualSteps: 2,
      minutes: 'about 6',
      summary: 'Yes. A three-step workflow (Gmail trigger, filter, add row) was live about six minutes after the prompt.',
      runs: [
        {
          label: 'Run (Nov 9)',
          result: 'pass',
          text: [
            'Copilot chose the Gmail "New Email" trigger, added a Filter by Zapier step (sender exactly matches our own address and subject contains "invoice") and a Google Sheets "Create Spreadsheet Row" step that maps sender, subject and date. It found the "AAI Test - Invoices" sheet by name without being told where it was.',
            'Two clicks were ours: Copilot said it cannot skip the sheet test or publish from the chat, and asked us to do both in the editor. On the live run it logged the four invoice emails, matched the lowercase "invoice" in "Your invoice is ready" and skipped "Re: lunch Friday".',
          ],
        },
      ],
      whyItMatters: 'This is the core promise of an AI workflow builder: describe it, get a working automation. Zapier delivered it with no corrections.',
    },
    {
      n: 2,
      question: 'Can it pull the amount and due date out of the email text?',
      name: 'Pull data out of text',
      prompt: 'Also pull the invoice amount and the due date from the email body into their own columns.',
      result: 'pass',
      corrections: 0,
      manualSteps: 3,
      minutes: 'about 6',
      summary: 'Yes. An "AI by Zapier" step extracted the amount and due date correctly for every format we sent, and left them blank when the email had none.',
      runs: [
        {
          label: 'Scored run (Nov 10)',
          result: 'pass',
          text: [
            'Copilot added an AI by Zapier step (Standard model, 1 task) with two outputs, invoice amount and due date, and the instruction to return an empty value when either is missing. It mapped both to the Amount and Due date columns itself.',
            'On the live run it returned "USD 2,350" / "12/15/2026", "$480.00" / "November 30, 2026" and "1.200,00 EUR" / "5 December 2026", and blanks for the email with no amount. The three manual steps were picking a sample email in the trigger, testing the AI step and testing the sheet step, as Copilot asked.',
            'A first attempt under an earlier setup failed and was not scored.',
          ],
        },
      ],
    },
    {
      n: 3,
      question: 'Can it branch: alert me only for large invoices?',
      name: 'Branching',
      prompt: 'If the amount is over $1,000, also email me a heads-up. Otherwise just log it.',
      result: 'pass',
      corrections: 0,
      manualSteps: 0,
      minutes: 'about 4',
      summary: 'Yes. It kept logging every invoice and added a filter plus an email step for amounts over $1,000.',
      runs: [
        {
          label: 'Run (Nov 10)',
          result: 'pass',
          text: [
            'Copilot reasoned about Paths versus a Filter and chose a Filter after the sheet row, which matches "otherwise just log it". Without being asked, it noticed the amount was text ("USD 2,350") and added a numeric version to the AI step so the comparison works on numbers.',
            'The heads-up email lists sender, subject, amount and due date. In both live runs alerts went out for the $2,350 and 1,200 EUR invoices and not for the $480 one. Note that it compared 1,200 EUR against $1,000 without converting currency, which is a fair reading of our prompt.',
          ],
        },
      ],
    },
    {
      n: 4,
      question: 'Can it add an AI-written summary of each email?',
      name: 'AI step',
      prompt: 'Add a one-sentence summary of each email to the Summary column.',
      result: 'pass',
      corrections: 0,
      manualSteps: 0,
      minutes: 'about 1',
      summary: 'Yes. Every row got one accurate sentence, different for each email.',
      runs: [
        {
          label: 'Run (Nov 10)',
          result: 'pass',
          text: [
            'Copilot added a second AI by Zapier step and mapped its output to the Summary column in about 15 seconds. Example from the live run: "Dana sent invoice #1041 for $480.00, due November 30, 2026."',
          ],
        },
      ],
    },
    {
      n: 5,
      question: 'What happens when an invoice email has no amount?',
      name: 'Bad input',
      prompt: null,
      result: 'fail',
      corrections: null,
      manualSteps: null,
      minutes: null,
      summary: 'The email was logged as a normal row with a blank Amount and Due date, and nothing flagged it.',
      runs: [
        {
          label: 'Both live runs (Nov 10)',
          result: 'fail',
          text: [
            'This task has no prompt. It checks what the finished workflow does by default with "Invoice for October", an email that says an invoice is attached but gives no amount or due date. To pass, the workflow must not write a junk row, or must make the problem visible (an error, an alert or a flagged row).',
            'In both runs the AI step correctly returned blanks, the row was written with empty Amount and Due date fields and a reasonable summary, and the over-$1,000 filter simply stopped. Nothing told the user a value was missing.',
          ],
        },
      ],
      whyItMatters: 'Blank rows are easy to miss in a growing sheet. A one-line follow-up prompt such as "flag rows with no amount" would likely fix it, but the test measures what the builder does unprompted.',
    },
    {
      n: 6,
      question: 'Can it edit the existing workflow by asking?',
      name: 'Edit by asking',
      prompt: 'Also add the label \'Logged\' to each email in Gmail after it is saved.',
      result: 'pass',
      corrections: 0,
      manualSteps: 0,
      minutes: 'about 2',
      summary: 'Yes on the second try: one step that applies the existing "Logged" label, and every invoice email was labelled.',
      runs: [
        {
          label: 'First run (Nov 10)',
          result: 'fail',
          text: [
            'Copilot edited the existing workflow, as required, but added two steps: "Create label" and then "Add label". Once the label existed, the create step failed with "Label name exists or conflicts", and no email in the live run received the label. Copilot had mentioned this risk in its own reasoning but kept the design.',
          ],
        },
        {
          label: 'Second run (Nov 10)',
          result: 'pass',
          text: [
            'In a fresh chat Copilot found the existing "Logged" label and built a single "Add label" step in 9 seconds. All four invoice emails were labelled in the live run and there were no errors.',
          ],
        },
      ],
    },
    {
      n: 7,
      question: 'Can it build a scheduled daily digest email?',
      name: 'Schedule and digest',
      prompt: 'Every weekday at 8am, email me a list of the invoice rows added the day before.',
      result: 'fail',
      corrections: 0,
      manualSteps: 2,
      minutes: 'about 50 and 20',
      summary: 'Not completed. It set up the weekday schedule and found yesterday\'s date, but could not produce one email listing several rows.',
      runs: [
        {
          label: 'First run (Nov 10, about 50 minutes)',
          result: 'fail',
          text: [
            'Copilot asked sensible questions (where the rows live, which columns, what a date looks like) and built the parts that work: a Schedule trigger for weekdays at 8:00 AM, a Formatter step for yesterday\'s date, a step that reads the sheet, and a filter on dates that start with yesterday. It caught for itself that the Date column includes a time.',
            'Combining the matching rows in one email is where it stopped. It tried Formatter (one column at a time), Digest by Zapier (which merged values across rows) and Code by Zapier (the code step test failed several times with "code is empty" although the code was saved, while the chat showed a green tick). It finally recommended one email per row, which changes the task, so we stopped.',
          ],
        },
        {
          label: 'Second run (Nov 10, about 20 minutes)',
          result: 'fail',
          text: [
            'Copilot planned a schedule, a spreadsheet lookup and an email. Its code step again could not read the rows reliably, so it offered two options: we add a helper column to the sheet, or it keeps trying with no promise. We took its recommended option and added the column and, when asked, a test row dated the day before (two manual steps). The lookup then found no rows, even for the test row, and Copilot said it could not pin down the cause before going back to the approach that had already failed. The email step was never built.',
          ],
        },
      ],
      whyItMatters: 'A daily summary of new rows is one of the most common requests for a workflow tool. The parts Copilot built were correct; the missing piece was combining several rows in one message.',
    },
    {
      n: 8,
      question: 'Can it explain why a workflow failed and fix it?',
      name: 'Explain and fix',
      prompt: 'Why did my workflow fail?',
      result: 'pass',
      corrections: 1,
      manualSteps: 1,
      minutes: 'about 8',
      summary: 'Yes, after one nudge to look at the latest run: it found "worksheet not found", re-pointed the step and the next invoice was logged.',
      runs: [
        {
          label: 'Run (Nov 10)',
          result: 'pass',
          text: [
            'How we broke it: renaming the Amount column and renaming the sheet tab did not break the workflow (Zapier tracks columns by position and the tab by an internal ID, which is good for users). So we replaced the tab: a new tab with the same name and headers, old tab deleted. The next invoice run was "safely halted" at the sheet step, with no row written and no alert.',
            'Copilot\'s first answer described older runs, with times in UTC, and the normal filter stops. After one correction ("I mean the most recent run, at 12:10 PM today Toronto time") it found the halted step, retested it, got "worksheet 0 not found", switched the step to the new tab, re-confirmed all seven column mappings and explained the cause correctly. We clicked Publish (Copilot cannot), sent one more invoice and it was logged.',
          ],
        },
      ],
    },
    {
      n: 9,
      question: 'Can it find each sender\'s company website?',
      name: 'Goal for an agent',
      prompt: 'For each new invoice sender, find their company\'s website and add it to the Website column.',
      result: 'pass',
      corrections: 0,
      manualSteps: 1,
      minutes: 'about 9 and 6',
      summary: 'Yes on the second try: no wrong websites were written. The first try wrote a government website for three invoices.',
      runs: [
        {
          label: 'First run (Nov 10)',
          result: 'fail',
          text: [
            'Copilot built three steps: an AI step that finds the company name in the email, a Web Search by Zapier step for "[company] official website", and an AI step that picks the official site. It also pointed out, fairly, that our sender filter means only our own emails reach these steps.',
            'The company names in our test emails are invented, so the correct answer is a blank Website or a site that really belongs to that company. When the company name came back blank, the search ran on "official website" alone and nyc.gov was written for three rows. For "Kestrel Consulting" it wrote a domain we could not link to the sender.',
          ],
        },
        {
          label: 'Second run (Nov 10)',
          result: 'pass',
          text: [
            'Same three-step design. During the build Copilot noticed on its own that a blank company name leads to generic government sites and rewrote the picker: return nothing if the company name is empty or no result clearly belongs to that company. In the live run it read "Kestrel Consulting" from the email, searched, and correctly left the Website blank. No wrong URL was written for any row.',
            'Note: the company step reads the email body and signature, not the subject, so companies named only in the subject were not looked up. One manual step: Copilot asked us to read a step\'s test data back to it.',
          ],
        },
      ],
    },
  ],
  planCheck: [
    'Every workflow in this test needed paid features that the 14-day Professional trial unlocks: a single Filter step makes a Zap "multi-step", and AI by Zapier steps and premium apps are paid. Zapier warned on publish that the Zap stops when the trial ends unless upgraded.',
    'Email by Zapier allows 5 emails per account per day on the Free and trial plans, and 10 per hour on Professional.',
    'Usage: about 10 Zapier tasks per invoice email in the finished 11-step workflow. Our whole test used fewer than 100 of the trial\'s 1,000 tasks.',
  ],
  howWeTested: [
    'This is a hands-on test of the AI builder, not a review of all of Zapier. We used the same nine tasks we use for every workflow builder, typed each prompt exactly as written, and started each task in a cleared Copilot chat.',
    'Account: a new Zapier sign-up on the 14-day Professional trial, connected to a test Gmail inbox and a Google Sheet with the columns Sender, Subject, Date, Amount, Due date, Summary and Website. The workflow only reacts to email the account sends to itself.',
    'Scoring: PASS means it works on a real run with 0 or 1 corrections. PARTIAL means it works only after 2 or more corrections or manual editing. FAIL means it does not work or cannot be done on the plan. Answering a question Copilot asks, or confirming a test, is not a correction. A click Copilot hands back to us (publish, skip a test, pick a sample) is a manual step.',
    'Second tries: any failed task gets one more try in a fresh session, because the tester is part of the test and can make mistakes too. We score the better run and publish both.',
    'Who ran it: The AI Agent Index. Zapier did not pay for this test and was not contacted before publication. The test does not change Zapier\'s rating on the index.',
  ],
  fixtures: [
    { subject: 'Invoice #1041 from Northwind Supplies', body: 'Hi, please find invoice #1041 for $480.00, due November 30, 2026. Thanks, Dana', note: 'Under $1,000. US formats.' },
    { subject: 'Invoice 2207 - Brightline Media', body: 'Amount due: USD 2,350. Payment due 12/15/2026.', note: 'Over $1,000. Numeric date.' },
    { subject: 'Your invoice is ready', body: 'Total: 1.200,00 EUR, due 5 December 2026. Kestrel Consulting', note: 'European number format, lowercase "invoice".' },
    { subject: 'Re: lunch Friday', body: 'Sounds good, see you at noon.', note: 'Not an invoice. Must not be logged.' },
    { subject: 'Invoice for October', body: 'Attached is our invoice for October. Let us know if you have questions.', note: 'No amount and no due date.' },
  ],
}

const TESTS: Record<string, AgentTest> = { zapier: ZAPIER }

export function getAgentTest(slug: string): AgentTest | null {
  return TESTS[slug] ?? null
}

/** The few fields the listing hero needs, so the full report is not sent to the browser. */
export interface AgentTestSummary {
  slug: string
  testedMonth: string
  passed: number
  partial: number
  of: number
  headline: string
  paid: boolean
}

export function getAgentTestSummary(slug: string): AgentTestSummary | null {
  const t = TESTS[slug]
  if (!t) return null
  const d = new Date(t.publishedOn + 'T12:00:00Z')
  return {
    slug: t.slug,
    testedMonth: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'America/Toronto' }),
    passed: t.score.passed,
    partial: t.score.partial,
    of: t.score.of,
    headline: t.headline,
    paid: !!t.sponsor,
  }
}

export function testedSlugs(): string[] {
  return Object.keys(TESTS)
}
