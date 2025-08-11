export type TokenizeOptions = {
    delimitersPattern?: RegExp;
    dedupeWithinCell?: boolean;
};

const DEFAULT_DELIMITERS = /[,;|]/g;

export function splitDelimitedTokens(rawValue: unknown, options?: TokenizeOptions): string[] {
    const delimitersPattern = options?.delimitersPattern ?? DEFAULT_DELIMITERS;
    const dedupeWithinCell = options?.dedupeWithinCell ?? true;

    if (typeof rawValue !== 'string') {
        return [];
    }

    const cleanedSource = rawValue.replace(/^\s*"|"\s*$/g, '').trim();
    if (cleanedSource.length === 0) {
        return [];
    }

    const roughTokens = cleanedSource
        .split(delimitersPattern)
        .map(token => token.trim())
        .filter(token => token.length > 0)
        .filter(token => !/^(-|n\/a|null|undefined)$/i.test(token));

    if (!dedupeWithinCell) {
        return roughTokens;
    }

    return Array.from(new Set(roughTokens));
}

// Email helpers
export function isLikelyEmail(token: string): boolean {
    // Simple, permissive email shape check; good enough for counting
    if (typeof token !== 'string') return false;
    const value = token.trim();
    if (!value.includes('@')) return false;
    if (/\s/.test(value)) return false;
    // Require at least one dot in domain part
    const parts = value.split('@');
    if (parts.length !== 2) return false;
    if (!parts[0] || !parts[1] || !parts[1].includes('.')) return false;
    return true;
}

export function normalizeEmail(token: string): string {
    return token.trim().toLowerCase();
}

// SHA256 helpers
export function isSha256Hex(token: string): boolean {
    return /^[a-fA-F0-9]{64}$/.test(token.trim());
}

export function normalizeHex(token: string): string {
    return token.trim().toLowerCase();
}

// Phone helpers
export function normalizePhoneDigits(token: string): string {
    return token.replace(/\D/g, '');
}

export function isLikelyPhone(digits: string): boolean {
    // Count as valid if it looks like a NANP/intl number with at least 10 digits
    const length = digits.length;
    return length >= 10 && length <= 15;
}

export function countTokensAcrossRows(
    data: any[],
    key: string,
    opts: {
        delimitersPattern?: RegExp;
        dedupeWithinCell?: boolean;
        normalize?: (t: string) => string;
        validator?: (t: string) => boolean;
    } = {}
): number {
    const delimitersPattern = opts.delimitersPattern ?? DEFAULT_DELIMITERS;
    const dedupeWithinCell = opts.dedupeWithinCell ?? true;
    const normalize = opts.normalize ?? ((t: string) => t);
    const validator = opts.validator ?? (() => true);

    let total = 0;

    for (const row of data) {
        const raw = row?.[key];
        const tokens = splitDelimitedTokens(raw, { delimitersPattern, dedupeWithinCell });
        if (tokens.length === 0) continue;

        const validTokens = tokens
            .map(normalize)
            .filter(validator);

        total += validTokens.length;
    }

    return total;
}

export function countTokensAcrossRowsForKeys(
    data: any[],
    keys: string[],
    opts: {
        delimitersPattern?: RegExp;
        dedupeWithinCell?: boolean;
        normalize?: (t: string) => string;
        validator?: (t: string) => boolean;
        dedupeWithinRowAcrossKeys?: boolean;
    } = {}
): number {
    const delimitersPattern = opts.delimitersPattern ?? DEFAULT_DELIMITERS;
    const dedupeWithinCell = opts.dedupeWithinCell ?? true;
    const normalize = opts.normalize ?? ((t: string) => t);
    const validator = opts.validator ?? (() => true);
    const dedupeWithinRowAcrossKeys = opts.dedupeWithinRowAcrossKeys ?? true;

    let total = 0;

    for (const row of data) {
        const rowSet = new Set<string>();

        for (const key of keys) {
            const raw = row?.[key];
            const tokens = splitDelimitedTokens(raw, { delimitersPattern, dedupeWithinCell });
            if (tokens.length === 0) continue;

            for (const token of tokens) {
                const normalized = normalize(token);
                if (!validator(normalized)) continue;
                if (dedupeWithinRowAcrossKeys) {
                    rowSet.add(normalized);
                } else {
                    total += 1;
                }
            }
        }

        if (dedupeWithinRowAcrossKeys) {
            total += rowSet.size;
        }
    }

    return total;
} 