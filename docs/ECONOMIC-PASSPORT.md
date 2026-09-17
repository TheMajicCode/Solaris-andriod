# Economic passport

**Nothing in this document is implemented.** There is no wallet, no reward
engine and no settlement path in build 604. This records the intended boundaries
so that an eventual bounded implementation task has a specification to be
reviewed against.

## Two adapters, deliberately separate

| Adapter | Scope | Status |
| --- | --- | --- |
| **Breez SDK — Spark** | Bitcoin, Spark and Lightning | Planned. Compatibility and recovery require validation. |
| **Tether WDK** | A self-custodial stablecoin wallet on one explicitly selected chain and account model | Planned. Chain, token and fee arrangements undecided. |

Breez also describes stablecoin capabilities. The selected Solaris split remains
**Breez for Bitcoin/Lightning, WDK for the stablecoin adapter**. Overlapping SDK
features do not authorize building two wallet systems.

### Breez Spark — open questions before any spike

- Official Android/Kotlin and React Native bindings exist; the React Native
  package contains native code. The **full native build gap is a real
  prerequisite** for integrating any new native module.
- Pin a reviewed compatible version against the app's real integration
  environment. Start on Breez's documented regtest environment: no real monetary
  value, no API key. Mainnet initialization has different credential and
  operational requirements.
- Document fee estimates and confirmations. Do not promise free payments.
- Self-custody still has operator and service dependencies. Spark's unilateral
  exit has data, fee-funding and timelock requirements, so **a mnemonic alone
  must never be advertised as guaranteed instant recovery during every outage**.

References: [Breez SDK Spark](https://sdk-doc-spark.breez.technology/),
[Android install](https://sdk-doc-spark.breez.technology/guide/install_android_kotlin.html),
[React Native install](https://sdk-doc-spark.breez.technology/guide/install_react_native.html),
[testing](https://sdk-doc-spark.breez.technology/guide/testing.html),
[initialization](https://sdk-doc-spark.breez.technology/guide/initializing.html),
[end-user fees](https://sdk-doc-spark.breez.technology/guide/end-user_fees.html),
[unilateral exit](https://sdk-doc-spark.breez.technology/guide/unilateral_exit.html).

### Tether WDK — decide before implementing

Choose **one** chain, token and account model first, then record: chain ID, token
contract, decimals, RPC/indexer dependencies, fees and recovery behaviour. A
stablecoin address is not universally interchangeable across networks. Ordinary
and smart-account modules have different gas, bundler and paymaster
requirements.

The current React Native quickstart specifies Node 22+, React Native 0.81+,
Android API 29+ and a Bare worklet. Its `beta.18` core lists Bare Kit `>=0.14.5`,
while the recovered 604 context records Bare Kit `0.14.0`. **Recheck and freeze
current versions inside the spike; do not upgrade the 604 QVAC/Bare runtime as
part of repository import or any documentation task.**

The WDK React Native storage helper does not itself provide seed generation, seed
encryption or cloud backup. Specify the complete key lifecycle and prove recovery
independently before any real-value activation.

References: [WDK module selection](https://docs.wdk.tether.io/sdk/wallet-modules/which-wallet-module/),
[ERC-4337](https://docs.wdk.tether.io/sdk/wallet-modules/wallet-evm-erc-4337/),
[React Native quickstart](https://docs.wdk.tether.io/start-building/react-native-quickstart/),
[secure storage](https://docs.wdk.tether.io/tools/react-native-secure-storage/).

## Contribution and reward states

These are six distinct states. Conflating any two of them is a defect:

```
recorded contribution → verified evidence → eligible allocation
   → approved payment → pending settlement → settled receipt
```

with `rejected`, `disputed` and `expired` where applicable.

**A contribution score or receipt is not spendable money.** Do not invent reward
amounts, guaranteed income, token appreciation, allocation percentages or a
universal funding source.

Earning requires all of: a named funder, a finite budget, published eligibility
rules, contribution verification, a policy version and a settlement process.

## Boundaries that must hold

- Wallet access is distinct from access to care and from a person's health
  status. Illness must never reduce entitlement.
- Participation is optional. Core health tools work without a wallet.
- Health information is never the price of admission to a reward program.
- Settlement is idempotent. **Retrying must not pay twice.** A durable outbox
  handles execution, deduplication and reconciliation of uncertain settlements,
  under its own separate authorization.
- Deterministic replay computes state. **Replay must never send a payment.**
- No wallet secret enters an AI prompt, a health record, this repository or an
  ordinary diagnostic log.
- Do not replicate live wallet signing state with a generic CRDT, or let several
  devices act as uncontrolled concurrent wallet writers.

## Prerequisites before any of this starts

`AND-09` (Breez spike) and `AND-10` (WDK decision and spike) in the
[Roadmap](ROADMAP.md) both depend on native and runtime feasibility, which
depends on `AND-02` — reconstructing the native build prerequisites. That is
currently [blocked on missing source](BUILD-AND-TEST.md).
