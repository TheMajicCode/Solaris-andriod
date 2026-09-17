"""Resolve every tracked path to one integrity role and one check scope."""
from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Rule:
    kind: str          # 'path' or 'prefix'
    value: str
    integrity: str
    scope: str

    @property
    def specificity(self) -> tuple[int, int]:
        # An exact path always beats a prefix; otherwise the longest prefix wins.
        return (1 if self.kind == 'path' else 0, len(self.value))


class Classification:
    def __init__(self, document: dict):
        self.document = document
        self.integrity_roles = set(document['integrity_roles'])
        self.check_scopes = set(document['check_scopes'])
        self.rules: list[Rule] = []
        for raw in document['rules']:
            kind = 'path' if 'path' in raw else 'prefix'
            value = raw.get('path') or raw['prefix']
            if raw['integrity'] not in self.integrity_roles:
                raise ValueError(f'unknown integrity role for {value}: {raw["integrity"]}')
            if raw['scope'] not in self.check_scopes:
                raise ValueError(f'unknown check scope for {value}: {raw["scope"]}')
            self.rules.append(Rule(kind, value, raw['integrity'], raw['scope']))
        # Highest specificity first so the first match is the winning one.
        self.rules.sort(key=lambda r: r.specificity, reverse=True)

    @classmethod
    def load(cls, path: Path) -> 'Classification':
        return cls(json.loads(path.read_text(encoding='utf-8')))

    def resolve(self, tracked_path: str) -> Rule | None:
        for rule in self.rules:
            if rule.kind == 'path':
                if tracked_path == rule.value:
                    return rule
            elif tracked_path.startswith(rule.value):
                return rule
        return None

    def partition(self, files: list[str]) -> tuple[dict[str, Rule], list[str]]:
        """Return (path -> rule) for classified files and a list of unclassified ones."""
        resolved: dict[str, Rule] = {}
        unclassified: list[str] = []
        for path in files:
            rule = self.resolve(path)
            if rule is None:
                unclassified.append(path)
            else:
                resolved[path] = rule
        return resolved, unclassified

    def paths_with_scope(self, resolved: dict[str, Rule], *scopes: str) -> list[str]:
        return sorted(p for p, r in resolved.items() if r.scope in scopes)

    def paths_with_integrity(self, resolved: dict[str, Rule], integrity: str) -> list[str]:
        return sorted(p for p, r in resolved.items() if r.integrity == integrity)
