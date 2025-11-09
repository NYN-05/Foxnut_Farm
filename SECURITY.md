# Security Policy

## 🔒 Security Best Practices

### Environment Variables

**NEVER commit actual credentials to Git!**

This repository uses `.env` files for sensitive configuration. These files are:
- ✅ Listed in `.gitignore`
- ✅ Never committed to the repository
- ✅ Only placeholders shown in documentation

### Setup Instructions

1. **Copy the example file:**
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Replace ALL placeholder values:**
   - `<username>` → Your MongoDB username
   - `<password>` → Your MongoDB password
   - `<cluster>` → Your MongoDB cluster name
   - `GENERATE_RANDOM_SECRET_HERE` → Use: `python -c "import secrets; print(secrets.token_hex(32))"`

3. **Verify `.env` is not tracked:**
   ```bash
   git status
   # Should NOT show .env files
   ```

## 🚨 Reporting Security Issues

If you discover a security vulnerability, please:

1. **DO NOT** create a public GitHub issue
2. Email the repository owner directly
3. Include detailed information about the vulnerability
4. Allow time for the issue to be addressed before public disclosure

## ✅ What We Do

- Use JWT tokens for authentication
- Hash all passwords with bcrypt
- Validate and sanitize all user inputs
- Use CORS protection
- Keep dependencies updated
- Follow OWASP security guidelines

## ❌ What NOT to Do

- Never commit `.env` files
- Never commit API keys or secrets
- Never use default/example credentials in production
- Never share your MongoDB connection string publicly
- Never disable security features in production

## 🔐 Credential Management

### MongoDB Atlas
1. Create database users with minimal required permissions
2. Use strong, unique passwords
3. Whitelist only necessary IP addresses
4. Enable two-factor authentication on your Atlas account
5. Rotate credentials regularly

### JWT Secrets
Generate secure random secrets:
```python
import secrets
print(secrets.token_hex(32))  # 64-character hex string
```

### API Keys (Stripe, SendGrid, Cloudinary)
1. Use test keys during development
2. Use live keys only in production
3. Rotate keys if compromised
4. Monitor usage for suspicious activity
5. Set up alerts for unusual API usage

## 📋 Security Checklist

Before deploying:
- [ ] All `.env` files are in `.gitignore`
- [ ] No credentials in source code
- [ ] No credentials in documentation
- [ ] Strong JWT secrets configured
- [ ] MongoDB Atlas IP whitelist configured
- [ ] All dependencies updated
- [ ] HTTPS enabled in production
- [ ] CORS properly configured
- [ ] Input validation enabled
- [ ] Error messages don't expose sensitive info

## 🔄 Regular Maintenance

- Update dependencies monthly: `pip install -r requirements.txt --upgrade`
- Review GitHub security alerts
- Rotate credentials quarterly
- Audit access logs
- Review user permissions

## 📞 Contact

For security concerns, contact the repository owner through GitHub.

---

**Last Updated:** November 9, 2025
