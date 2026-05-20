/**
 * Safely render a populated party reference.
 *
 * Backend DTOs return party as one of:
 *   - { id, name, ... }  (populated)
 *   - "<24-char id>"     (unpopulated, just the id)
 *   - null               (no party set)
 *
 * Frontend types are narrowed accordingly. Use this helper to avoid
 * repeating the typeof / null guard at every call site.
 */
type PartyRef = { id: string; name: string } | string | null | undefined;

export function partyName(party: PartyRef, fallback = "—"): string {
  if (!party) return fallback;
  if (typeof party === "string") return party;
  return party.name;
}

export function partyId(party: PartyRef, fallback = ""): string {
  if (!party) return fallback;
  if (typeof party === "string") return party;
  return party.id;
}
