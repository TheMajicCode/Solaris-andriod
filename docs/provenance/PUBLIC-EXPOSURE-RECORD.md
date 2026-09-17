# Public exposure record

**Status: the repository is still PUBLIC as of the inspection below.** This
record exists because every governing document for this work assumes a private
repository, and because making a repository private later cannot retract what
was already downloaded, cloned, forked or cached.

## What happened

| When | What |
| --- | --- |
| Repository created | `TheMajicCode/Solaris-andriod`, public from creation |
| Before this work | `main` held a README; `import/604-source` held the 20 MB transport archive, its checksum file and the import prompt |
| During the first session | The 604 source projection and repository bootstrap were pushed to `claude/solaris-android-import-iyla4d`, and draft PR #1 was opened, **while the repository was public** |
| Now | The owner's direction is private development. Visibility is unchanged because no tool in this session can change it. |

The push to a public repository was made after the conflict was raised and on
the owner's explicit instruction at that time. That instruction has since been
superseded by the private-development direction, which is why publication is now
blocked rather than continued.

## Inspection performed

Read-only, on the local clone of all reachable history, at the commit recorded in
`docs/workflow/STATUS.md`. Nothing was rewritten, rotated or deleted.

| Measure | Result |
| --- | --- |
| Commits reachable across all refs | 4 |
| Distinct paths ever published | 1,921 |
| Distinct blobs ever reachable | 1,553 |
| Text blobs whose **contents** were pattern-scanned | 1,341 |
| Non-text blobs not content-scanned | 212 (208 extensionless `.hasm`-adjacent/reference files, 2 PNG, 1 `.2`, 1 `.xz`) |
| Credential-shaped **filenames** across all history | none |
| Credential **content** patterns across all scanned blobs | none |
| Private phone evidence / patient-record paths | none |
| Binaries or archives published | one: `Solaris-604-GitHub-Source-Import.tar.xz` |
| Forks of the repository | 0 at inspection |
| Stars / watchers | 0 at inspection |

Patterns searched: PEM private-key and encrypted-private-key blocks, AWS access
key IDs, GitHub tokens, Slack tokens, Google API keys, bearer-authorization
headers, and mnemonic/seed-phrase labels. Credential-shaped filenames (`.jks`,
`.keystore`, `.p12`, `.pfx`, `.pem`, `.key`, `local.properties`,
`key.properties`, `.env`, `id_rsa`, `.npmrc`, `.pypirc`) were searched across
every path in every reachable commit.

## What this does and does not establish

**It establishes** that no credential-shaped filename and no matched credential
pattern is present in the published text, and that no private phone evidence or
patient-record path was ever tracked. The import's exclusion policy — which kept
private phone evidence, APKs, models, keystores and bundled dependencies out —
held.

**It does not establish** that nothing was exposed:

- A finite pattern set cannot prove the absence of all secrets. A credential in
  an unusual format would not match.
- 212 non-text blobs were not content-scanned.
- **No finding is not proof of no historical exposure.** Anyone could have
  cloned, forked or cached the repository while it was public, and GitHub's own
  caches and third-party mirrors are outside this inspection.
- Licensing exposure is separate and **unresolved**: retained recovered and
  third-party material was published before the content and licensing review
  that `docs/THIRD-PARTY-NOTICES.md` calls for. Making the repository private
  does not retroactively grant redistribution rights.

## What was deliberately NOT done

Per the governing instruction, and because no concrete finding justifies them:

- **No credential rotation.** Nothing was found that would warrant it.
- **No Android signer change.** The existing development signing identity is
  preserved; replacing it would break the update lineage.
- **No history rewrite.** The transport object stays in `import/604-source`
  history. Rewriting would break provenance and cannot un-publish anything.
- **No visibility change.** No tool in this session can make the repository
  private; see the owner action in `docs/workflow/STATUS.md`.

Any remediation beyond this record is a separate decision requiring a concrete
finding.
