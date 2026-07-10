# Landing Page — Hard Rules (non-negotiable, every session)

1. **The Stripe payment-link registry** (in this project's Claude memory,
   `landing-page-essentials.md`) **is definitive.** Never wire, swap, or re-enable a
   payment link without (a) checking its slug against the registry AND git history for
   staleness, and (b) Terri personally opening it and reading the product name and
   billing period on the checkout page. A wrong link once charged her for the wrong
   product. If the same URL arrives twice in chat, suspect a stale clipboard.

2. **Never declare launch readiness "verified" or "all green" unless every piece was
   POSITIVELY confirmed** (observed working, or read from the authoritative
   dashboard/DB/logs). Itemize VERIFIED vs UNVERIFIED — no bundling. "No visible
   failures" is not verification.

3. **State costs before any step that spends Terri's money.** Test purchases cost her
   real card fees; prefer Stripe event resends and dashboard reads (free).

4. **A purchase button only goes public AFTER a full rehearsal passed:** real purchase →
   fulfillment email arrived → product unlocked/downloaded.

5. Deploy = `NODE_OPTIONS="--use-system-ca" npx wrangler deploy` from this folder
   (Worker `terristech`, serves terristech.com). Verify the live page after deploy.
