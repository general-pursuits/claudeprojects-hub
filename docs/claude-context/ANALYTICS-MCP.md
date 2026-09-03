# Google Analytics MCP server (analytics-mcp) - setup runbook

Canonical setup steps for the official Google Analytics MCP server, so any session can hand Addie
the exact commands instead of re-deriving them. Package: `analytics-mcp` on PyPI
(github.com/googleanalytics/google-analytics-mcp). Google labels it experimental.

_Created 2026-09-03._

## What it adds

Read-only Google Analytics access from inside Claude Code, via the GA Admin API and GA Data API:

- `get_account_summaries`, `get_property_details`, `list_google_ads_links`
- `run_report`, `run_funnel_report`, `get_custom_dimensions_and_metrics`
- `run_realtime_report`

Relevant property: opportunitydesigned.com, GA4 measurement ID G-M1FVLM07Z1. The tools want the
numeric GA4 property ID, which `get_account_summaries` returns on the first call.

## Where it can and cannot be installed

`claude mcp add --scope user` writes to `~/.claude.json` on the machine running the command.
Run it on Addie's Mac. Running it inside a Claude Code cloud session writes to a container that is
destroyed when the session ends, so it does not persist and is not worth doing.

This means analytics-mcp is a Mac-session tool. Phone and web sessions will not see it.
For GA4 data in a cloud session, use the Supermetrics connector instead (see "Overlap" below).

## Prerequisites

1. A Google Cloud project. No charge at the tiers involved, and both APIs are callable at no cost.
2. `pipx` installed (https://pipx.pypa.io/stable/#install-pipx).
3. Python 3.10 or newer.
4. `gcloud` CLI installed.
5. A Google account with read access to the GA4 property. Addie's own account qualifies.

## Steps (run on the Mac)

### 1. Enable both APIs in the Google Cloud project

- Google Analytics Admin API: https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com
- Google Analytics Data API: https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com

### 2. Create an OAuth desktop client and download its JSON

Google Cloud console, APIs and Services, Credentials, Create credentials, OAuth client ID,
application type Desktop app. Download the client JSON.

APPROVAL GATE: creating and consenting to the OAuth client is Addie's to do. Per CORE-RULES,
no session grants OAuth on her behalf.

### 3. Set up Application Default Credentials with the read-only Analytics scope

```shell
gcloud auth application-default login \
  --scopes https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform \
  --client-id-file=YOUR_CLIENT_JSON_FILE
```

When it finishes it prints:

```
Credentials saved to file: [PATH_TO_CREDENTIALS_JSON]
```

Copy that path. On macOS it is usually
`/Users/addie/.config/gcloud/application_default_credentials.json`.

The `analytics.readonly` scope is required. Without it the server authenticates but every GA call
returns a permission error.

### 4. Register the server with Claude Code

Substitute the real path from step 3 and the real Google Cloud project ID
(console home page, or `gcloud config get-value project`):

```shell
claude mcp add analytics-mcp \
  --scope user \
  -e "GOOGLE_APPLICATION_CREDENTIALS=/Users/addie/.config/gcloud/application_default_credentials.json" \
  -e "GOOGLE_PROJECT_ID=YOUR_PROJECT_ID" \
  -- pipx run analytics-mcp
```

`--scope user` makes it available in every project on the Mac, not just one repo.

### 5. Verify

Start Claude Code and run `/mcp`. `analytics-mcp` should be listed and connected. Then ask:

```
Give me details about my Google Analytics property with 'opportunity' in the name
```

Save the numeric property ID it returns into PROJECT-MEMORY.md so later sessions skip the lookup.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `/mcp` shows analytics-mcp as failed | `pipx` not on the PATH Claude Code inherits | `which pipx`, then re-add using that absolute path in place of `pipx` |
| Server connects, every GA call is denied | ADC missing the `analytics.readonly` scope | re-run step 3 with the full `--scopes` string |
| `PERMISSION_DENIED` naming an API | one of the two APIs not enabled | step 1 |
| Quota or billing error | wrong `GOOGLE_PROJECT_ID` | `gcloud config get-value project`, re-add with the right ID |
| Wrong or empty account list | ADC created under a Google account without GA access | re-run step 3 signed in as the account that owns the property |

To remove or re-add: `claude mcp remove analytics-mcp --scope user`, then repeat step 4.

## Overlap with Supermetrics

Supermetrics already covers GA4 in cloud sessions and is what od-keyword-research,
od-website-standards, and od-ai-visibility-tracker call for traffic ground truth. analytics-mcp is
a second, direct path with no vendor in between, useful on the Mac for ad hoc reporting and realtime
data. It does not replace Supermetrics, and Google Search Console query data still comes from
Supermetrics or GSC directly, since GA4 carries no query data.

## Data-handling note

The credentials file is a live token for her Google account. It stays on the Mac. Do not commit it,
do not paste its contents into a chat, and do not copy it into this repo.
