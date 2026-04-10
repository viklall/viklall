# Automated Digest Publishing Workflow

1. **Scheduled Retrieval**: Agent periodically checks sources (NewsAPI, Twitter/X, Meetup APIs) for updates.
2. **Curated Draft**: Agent pulls content, filters for relevance, and generates a draft in `website/drafts/next_issue.md`.
3. **User Review**: Agent notifies you via Telegram: "Draft ready for review: /home/viklall/.openclaw/workspace/website/drafts/next_issue.md"
4. **Approval**: You review and reply with "/approve" or "/reject".
5. **Publish**: Upon approval, agent triggers:
    - Update `website/public/index.html` with new content.
    - Git commit/push to your hosting provider (GitHub/GitLab/etc).
    - Trigger Cloudflare Pages deployment via API.

## Pending Actions
- [ ] Implement `fetch_news.py` to automate source collection.
- [ ] Create `drafts/` directory in `website/`.
- [ ] Setup approval command hook in OpenClaw.
EOF
