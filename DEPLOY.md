# Deploy notes

- Production alias: https://glyphbound-align-2caebdf4.vercel.app
- Team scope: align-2caebdf4 (Vercel Authentication / SSO currently enabled on the team — public curl gets 302 to SSO)
- Source: https://github.com/davidlinjiahao/glyphbound
- Local: `npm run build` passes at `/workspace/glyphbound`

To disable SSO protection: Vercel dashboard → Project glyphbound → Deployment Protection → turn off Vercel Authentication (requires team scope re-auth in MCP).
