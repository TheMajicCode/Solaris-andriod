"""A real JSONC scanner.

Comments are removed by walking the document one character at a time and
tracking whether we are inside a string literal, so a `//` or `/*` that appears
inside a string or a URL is preserved. A regex sweep cannot do this: it damages
`"https://example.com"` and `"a /* b"` alike.

Only `devcontainer.json`, `tsconfig.json` and `jsconfig.json` are JSONC by
specification. Everything else in this repository must be strict JSON.
"""
from __future__ import annotations

import json

__all__ = ['strip_comments', 'loads', 'JSONC_NAMES']

JSONC_NAMES = frozenset({'devcontainer.json', 'tsconfig.json', 'jsconfig.json'})


def strip_comments(text: str) -> str:
    """Return `text` with // and /* */ comments replaced by equivalent whitespace.

    Comment bytes become spaces (newlines preserved) so that error line/column
    numbers from the subsequent json.loads still point at the original source.
    """
    out = []
    i = 0
    n = len(text)
    in_string = False
    quote = ''
    while i < n:
        ch = text[i]

        if in_string:
            out.append(ch)
            if ch == '\\' and i + 1 < n:
                # Copy the escaped character verbatim; it can legally be a quote.
                out.append(text[i + 1])
                i += 2
                continue
            if ch == quote:
                in_string = False
            i += 1
            continue

        if ch in '"\'':
            # JSON proper only allows ", but tracking ' too keeps us safe on
            # JSONC dialects that permit it rather than mis-detecting a comment.
            in_string = True
            quote = ch
            out.append(ch)
            i += 1
            continue

        if ch == '/' and i + 1 < n:
            nxt = text[i + 1]
            if nxt == '/':
                while i < n and text[i] != '\n':
                    out.append(' ')
                    i += 1
                continue
            if nxt == '*':
                end = text.find('*/', i + 2)
                if end == -1:
                    raise ValueError('unterminated block comment')
                for c in text[i:end + 2]:
                    out.append('\n' if c == '\n' else ' ')
                i = end + 2
                continue

        out.append(ch)
        i += 1

    if in_string:
        raise ValueError('unterminated string literal')
    return ''.join(out)


def loads(text: str, *, jsonc: bool):
    """Parse `text`, stripping comments first only when `jsonc` is true."""
    return json.loads(strip_comments(text) if jsonc else text)
