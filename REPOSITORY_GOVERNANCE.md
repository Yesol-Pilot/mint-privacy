# Repository Governance Contract

Policy ID: `ng-repo-governance/1.0.0`
Last reviewed: 2026-08-27

## Identity

- Repository: `Yesol-Pilot/mint-privacy`
- Lifecycle class: `public-privacy-surface`
- Current owner: `Yesol-Pilot`
- Intended owner: `NeoGenesisAI`
- Canonical branch: `main`
- Visibility: `public`
- Production status: `UNKNOWN`
- Transfer state: `REQUIRED`

`UNKNOWN` means not independently verified and must never be reported as PASS.

## Purpose and current risk

This repository publishes privacy information for MINT games or services. A privacy page is an operational contract and must match the exact shipped products, SDKs, analytics, ads, purchases, storage, retention, processors, and deletion paths.

- Active public URL, covered products and versions, actual SDK inventory, data flows, retention, processors, contact path, and deletion behavior remain `UNKNOWN`.
- Generic policy text must not claim that data is absent when runtime or provider systems collect it.
- Store declarations, in-app disclosure, consent UI, privacy policy, and backend behavior must not diverge.
- Personal data, account exports, analytics samples, credentials, and private incident evidence are prohibited in Git history.

## Required remediation

- [ ] List every covered product, package or app ID, version, operator, SDK, processor, data category, purpose, retention, transfer, rights, contact, and deletion path.
- [ ] Reconcile policy text against source manifests, network behavior, analytics, ads, IAP, backend, store declarations, and actual user controls.
- [ ] Run full-history secret, dependency, link, public-claim, legal-text drift, and personal-data audits.
- [ ] Add policy schema, product coverage, SDK inventory, URL, link, locale, store declaration, consent, deletion, accessibility, publication, and rollback checks.
- [ ] Version policy changes and preserve the exact effective date and product commit mapping.
- [ ] Transfer the repository to `NeoGenesisAI` while preserving the public URL and store links.

## Pull-request and branch rules

- PRs declare affected products, data categories, SDKs, processors, legal basis or purpose, retention, rights, public URL, and effective date.
- Review conversations resolve before squash merge.
- `main` is not force-pushed or deleted.

## Exit criteria

The repository becomes `TRANSFERRED_COMPLIANT` only when organization ownership, exact product coverage, source-to-policy reconciliation, public availability, user rights and deletion, store consistency, version history, and rollback are proven.

The presence of this file alone is not compliance.
