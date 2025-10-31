# Quick Deployment Guide

Fast-track deployment instructions for Altar Día de Muertos.

## Prerequisites Check

```bash
npm run deploy:check
```

## Option 1: Amplify Console (Recommended)

### Step 1: Prepare Repository

```bash
# Initialize git (if needed)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/your-username/altar.git

# Push
git push -u origin main
```

### Step 2: Deploy to Amplify

1. Go to: https://console.aws.amazon.com/amplify/
2. Click **"New app"** → **"Host web app"**
3. Select your Git provider (GitHub/GitLab/Bitbucket)
4. Authorize and select repository
5. Select branch: `main`
6. Review build settings (amplify.yml auto-detected)
7. Click **"Save and deploy"**

### Step 3: Enable Bedrock

1. Go to: https://console.aws.amazon.com/bedrock/
2. Click **"Model access"**
3. Request access to **Stable Diffusion** or **DALL-E**
4. Wait for approval (usually instant)

### Step 4: Test

1. Wait for deployment to complete (~5-10 minutes)
2. Click the deployment URL
3. Test photo upload and altar generation
4. Verify all features work

**Done!** 🎉

## Option 2: Amplify CLI Sandbox (Testing)

### Step 1: Configure AWS

```bash
aws configure
```

Enter your AWS credentials.

### Step 2: Deploy Sandbox

```bash
npx ampx sandbox
```

### Step 3: Run Frontend

```bash
npm run dev
```

### Step 4: Test

Open http://localhost:5173 and test all features.

## Verification

After deployment, verify:

```bash
npm run deploy:verify
```

## Troubleshooting

### Build Fails

```bash
# Rebuild locally first
npm run build

# Check for errors
npm run deploy:check
```

### Bedrock Access Denied

1. Go to Lambda function in AWS Console
2. Check IAM role has `bedrock:InvokeModel` permission
3. Request Bedrock model access if needed

### CORS Errors

1. Check S3 bucket CORS configuration
2. Verify API Gateway CORS settings
3. Ensure Amplify domain is allowed

## Need Help?

- **Full Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Checklist**: See [deployment-checklist.md](.kiro/specs/altar-dia-de-muertos/deployment-checklist.md)
- **Summary**: See [deployment-summary.md](.kiro/specs/altar-dia-de-muertos/deployment-summary.md)

## Estimated Time

- **Amplify Console**: 10-15 minutes
- **CLI Sandbox**: 5 minutes

## Estimated Cost

~$25-35/month for 1000 altars

---

**Ready to deploy?** Follow Option 1 above! 🚀
