# PRISM Prompt: Scaler OMR Scanner GLM-4.6V-Flash Support

Use this prompt with an AI coding agent to update the existing OMR scanner so the UI can select `GLM-4.6V-Flash` and the scan pipeline can actually run against it.

---

## Prompt

You are a senior frontend engineer and pragmatic integration lead.

Use the PRISM framework below and start implementation immediately.

Do not stop at planning.
After the initial audit and implementation decision, begin execution.

## P — Purpose

Update the existing frontend-only OMR scanner in `Scaler-Future-Fit/omr-scannner` so users can select `GLM-4.6V-Flash` in the UI and process OMR PDFs with it.

This is not only a UI-label change.
The current app is tightly coupled to Gemini in storage keys, service naming, copy, dependency choice, and request flow.

Your objective is to:

1. audit the current model-selection and AI request path
2. add support for `GLM-4.6V-Flash`
3. keep the existing Gemini path working
4. make the model selection UI explicit and easy to use
5. preserve the current OMR extraction, merge, preview, and CSV export flow

You are optimizing for:

- minimal-change implementation
- correct provider-aware architecture
- working end-to-end OMR processing
- no regression to the current Gemini workflow

You are not optimizing for:

- large UX redesign
- speculative multi-provider platform architecture
- adding many extra models beyond what is needed
- backend expansion unless it is proven necessary

## R — Role

Act as:

- a senior React + TypeScript engineer
- a practical API integration owner
- a maintainer who improves structure only where the current code forces it
- a delivery-focused implementer who validates the result before stopping

Your behavior should be:

- concrete
- implementation-first
- conservative with scope
- explicit about assumptions and blockers

Do not produce generic architecture advice.
Do not fake support by only changing UI text.
Do not add unnecessary abstraction if a small model registry plus provider adapter is enough.

## I — Inputs

### Repository

Repository path:

- `/Users/anuraagpatil/naviksha/Scaler-Future-Fit/omr-scannner`

App path:

- `/Users/anuraagpatil/naviksha/Scaler-Future-Fit/omr-scannner/frontend`

### Read These Local Files First

- `/Users/anuraagpatil/naviksha/Scaler-Future-Fit/omr-scannner/doc/prd.md`
- `/Users/anuraagpatil/naviksha/Scaler-Future-Fit/omr-scannner/doc/task_tracker.md`
- `/Users/anuraagpatil/naviksha/Scaler-Future-Fit/omr-scannner/doc/issue_tracker.md`
- `/Users/anuraagpatil/naviksha/Scaler-Future-Fit/omr-scannner/frontend/package.json`
- `/Users/anuraagpatil/naviksha/Scaler-Future-Fit/omr-scannner/frontend/src/App.tsx`
- `/Users/anuraagpatil/naviksha/Scaler-Future-Fit/omr-scannner/frontend/src/components/ApiKeyModal.tsx`
- `/Users/anuraagpatil/naviksha/Scaler-Future-Fit/omr-scannner/frontend/src/components/Dashboard.tsx`
- `/Users/anuraagpatil/naviksha/Scaler-Future-Fit/omr-scannner/frontend/src/lib/gemini-service.ts`
- `/Users/anuraagpatil/naviksha/Scaler-Future-Fit/omr-scannner/frontend/src/lib/prompts.ts`
- `/Users/anuraagpatil/naviksha/Scaler-Future-Fit/omr-scannner/frontend/src/lib/types.ts`

### Current Repo Facts You Must Respect

The current codebase has these constraints:

- `App.tsx` stores credentials in `sessionStorage` under `gemini_api_key` and `gemini_model`, and defaults to `gemini-2.5-flash`
- `ApiKeyModal.tsx` is Gemini-branded and uses a free-text model input instead of an explicit selector
- `Dashboard.tsx` imports `GeminiService` directly and assumes a Gemini-specific service instance
- `gemini-service.ts` wraps `@google/generative-ai` directly
- `package.json` currently includes `@google/generative-ai` and does not include a Z.AI/OpenAI-compatible client
- the OMR prompts, page classification flow, student ID persistence logic, table rendering, and CSV export already work and should be preserved
- the PRD explicitly says this is a frontend-only app

### External Facts To Use As Primary Inputs

Use official Z.AI documentation as the source of truth.

As of March 24, 2026, the official docs indicate:

- Z.AI general API base URL: `https://api.z.ai/api/paas/v4`
- Z.AI supports OpenAI-compatible client usage with the above `baseURL`
- the GLM-4.6V family includes `GLM-4.6V-Flash`
- the documented model code is `glm-4.6v-flash`
- GLM-4.6V models accept multimodal inputs in chat completions

Primary references:

- `https://docs.z.ai/api-reference/introduction`
- `https://docs.z.ai/api-reference/llm/chat-completion`
- `https://docs.z.ai/guides/vlm/glm-4.6v`
- `https://docs.z.ai/guides/overview/concept-param`

### Scope

In scope:

- add `GLM-4.6V-Flash` as a selectable UI option
- make that selection functional in the real OMR processing flow
- keep Gemini support intact
- refactor the AI client layer so `Dashboard` is not hard-wired to Gemini
- update app copy and storage names where Gemini-specific wording is now misleading
- run validation and leave the repo in a working state

Out of scope unless strictly required:

- adding a backend
- adding unrelated providers
- redesigning the whole dashboard
- changing the OMR prompts unless provider behavior forces a small compatibility adjustment

### Technical Decision Rules

- prefer a model registry over free-text model entry
- prefer a provider-neutral client contract such as `analyzeOMR(imageBase64, systemPrompt)`
- keep `Dashboard` provider-agnostic
- preserve the existing sequential PDF page workflow
- preserve the existing JSON parsing hardening unless the new provider supports a better JSON mode you can safely adopt
- do not assume the browser can safely use any Node SDK without verification
- if the OpenAI SDK is awkward or unsafe in-browser for this use case, prefer a typed `fetch` wrapper over inventing a backend
- do not break the frontend-only constraint unless you can prove an official-browser path is blocked or insecure

### Preferred UX Direction

Prefer a simple explicit selector instead of a raw text field.

Minimum acceptable options:

- `Gemini 2.5 Flash` -> provider `google`, model `gemini-2.5-flash`
- `GLM-4.6V-Flash` -> provider `zai`, model `glm-4.6v-flash`

You may keep additional Gemini options only if they already fit the flow cleanly.

It is acceptable to infer provider from the selected model instead of adding a separate provider dropdown, as long as the UI is clear and the implementation is maintainable.

### Likely Change Areas

Expect to touch some or all of:

- `/Users/anuraagpatil/naviksha/Scaler-Future-Fit/omr-scannner/frontend/src/App.tsx`
- `/Users/anuraagpatil/naviksha/Scaler-Future-Fit/omr-scannner/frontend/src/components/ApiKeyModal.tsx`
- `/Users/anuraagpatil/naviksha/Scaler-Future-Fit/omr-scannner/frontend/src/components/Dashboard.tsx`
- `/Users/anuraagpatil/naviksha/Scaler-Future-Fit/omr-scannner/frontend/src/lib/gemini-service.ts`
- new provider-neutral client files if needed
- `/Users/anuraagpatil/naviksha/Scaler-Future-Fit/omr-scannner/frontend/package.json`
- relevant documentation files if the behavior or setup instructions change

## S — Steps

Follow these steps in order:

1. audit the current model-selection and request path
2. verify the official GLM model code and request shape from the Z.AI docs
3. decide the thinnest safe integration path for a frontend-only app
4. introduce a small provider-aware model registry
5. replace the free-text model input with an explicit selector that includes `GLM-4.6V-Flash`
6. refactor the Gemini-specific service into a provider-neutral AI client boundary
7. implement the Z.AI / GLM request path for multimodal OMR analysis
8. keep Gemini support working through the same higher-level client contract
9. rename or migrate Gemini-specific session keys and copy where needed so the app no longer implies Gemini-only support
10. keep the current extraction prompts, page classification flow, student ID persistence, table updates, and CSV export intact
11. validate with `npm run build` and any other practical checks
12. update docs briefly if the configuration flow or supported models changed

## M — Mandatory Output Format

Your first response must contain exactly these sections:

### 1. Current State
- Current model/provider coupling points
- Main implementation risk
- Files that must change

### 2. Integration Decision
- Chosen frontend integration path
- Why it is the smallest correct change
- Assumptions being made

### 3. Immediate Implementation
- First edits to make
- Why those are first
- What you are changing now

After that first response, begin implementation immediately.

For every later update, use exactly this structure:

### Progress Update
- What changed
- Files touched
- Validation performed
- Assumptions or blockers
- Next step

## Acceptance Criteria

The work is only complete if all of the following are true:

- the configuration UI offers `GLM-4.6V-Flash` as an explicit selectable option
- selecting `GLM-4.6V-Flash` actually routes requests through a real GLM-compatible client path
- the app can still run with Gemini
- the main app state and session storage are no longer misleadingly Gemini-only
- the dashboard no longer imports a Gemini-only service directly
- the existing OMR pipeline behavior remains intact
- the build passes

## Stop Conditions

Stop and report clearly if any of the following happens:

- official docs or runtime behavior show that secure direct browser use is not viable for the chosen GLM client path
- CORS or credential-handling limitations force a backend despite the frontend-only requirement
- the available GLM path cannot support the current image + prompt request pattern without a larger product decision

If blocked, do not hand-wave.
Explain the exact blocker, the evidence, and the smallest fallback path.

## Non-Negotiables

- do not only add a label or dropdown option without real request support
- do not duplicate large chunks of dashboard logic for Gemini vs GLM
- do not leave Gemini-only naming everywhere after adding GLM support
- do not break the export flow, merge logic, or existing page prompts
- do not add a backend unless it is genuinely required

## Success Condition

Success means the repo has a believable, working path where:

- the user can select `GLM-4.6V-Flash` in the UI
- that choice is backed by real provider-aware request logic
- Gemini still works
- the OMR scanner remains simple to operate
- the implementation is validated rather than only proposed
