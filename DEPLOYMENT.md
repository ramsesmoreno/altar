# Deployment Guide - Altar Día de Muertos

This guide covers deploying the Altar application to AWS using Amplify Gen 2.

## Prerequisites

Before deploying, ensure you have:

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured (`aws configure`)
3. **Node.js 18+** and npm installed
4. **Git** repository (GitHub, GitLab, or Bitbucket)

## Step 1: Install Amplify CLI

Install the Amplify Gen 2 CLI globally:

```bash
npm install -g @aws-amplify/backend-cli
```

Or use it via npx:

```bash
npx @aws-amplify/backend-cli@latest
```

## Step 2: Build Production Bundle

Build the frontend application:

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Step 3: Deploy Backend Infrastructure

### Option A: Deploy via Amplify Sandbox (Development)

For development and testing:

```bash
npx ampx sandbox
```

This creates a temporary backend environment for testing.

### Option B: Deploy via Amplify Console (Production)

1. **Push code to Git repository**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Amplify Console**:
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"
   - Connect your Git repository
   - Select the branch (e.g., `main`)

3. **Configure Build Settings**:
   
   Amplify will auto-detect the build settings. Verify they match:
   
   ```yaml
   version: 1
   backend:
     phases:
       build:
         commands:
           - npm ci
           - npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

4. **Configure Environment Variables** (if needed):
   - In Amplify Console, go to "Environment variables"
   - Add any required variables (none needed for basic setup)

5. **Deploy**:
   - Click "Save and deploy"
   - Amplify will build and deploy both backend and frontend

## Step 4: Configure AWS Services

### S3 Bucket Configuration

The backend automatically creates an S3 bucket. Verify:

1. Go to [S3 Console](https://console.aws.amazon.com/s3/)
2. Find the bucket (name starts with `amplify-altar-storage`)
3. Verify CORS configuration allows your domain
4. Check lifecycle policies for old images (optional)

### Lambda Functions

Verify Lambda functions are deployed:

1. Go to [Lambda Console](https://console.aws.amazon.com/lambda/)
2. Find functions:
   - `uploadPhoto` - Handles photo uploads
   - `generateAltar` - Generates altar images with Bedrock

3. Check environment variables:
   - `STORAGE_BUCKET_NAME` should be set

### Bedrock Access

Ensure the `generateAltar` Lambda has Bedrock permissions:

1. Go to Lambda function → Configuration → Permissions
2. Verify IAM role has `bedrock:InvokeModel` permission
3. Request Bedrock model access if needed:
   - Go to [Bedrock Console](https://console.aws.amazon.com/bedrock/)
   - Request access to Stable Diffusion or DALL-E model
   - Wait for approval (usually instant for most models)

## Step 5: Test Deployed Application

### Smoke Tests

1. **Access the application**:
   - Get URL from Amplify Console
   - Open in browser

2. **Test photo upload**:
   - Upload a valid image (JPEG, PNG, or WEBP)
   - Verify preview appears
   - Check file size validation (max 10MB)

3. **Test altar generation**:
   - Enter food description (10-500 characters)
   - Submit form
   - Verify loading state appears
   - Check generated altar displays

4. **Test localStorage**:
   - Create multiple altars
   - Refresh page
   - Verify altars persist

5. **Test gallery**:
   - Navigate to gallery
   - Verify altars display in reverse chronological order
   - Test delete functionality

6. **Test download**:
   - Open altar detail view
   - Click download button
   - Verify image downloads with correct filename

### Cross-Browser Testing

Test on:
- Chrome (desktop and mobile)
- Firefox
- Safari (desktop and iOS)
- Edge

### Mobile Testing

Test responsive design on:
- iPhone (Safari)
- Android (Chrome)
- Various screen sizes (320px to 2560px)

## Step 6: Monitor and Verify

### CloudWatch Logs

Monitor Lambda function logs:

```bash
aws logs tail /aws/lambda/uploadPhoto --follow
aws logs tail /aws/lambda/generateAltar --follow
```

### Amplify Console Monitoring

Check Amplify Console for:
- Build status
- Deployment history
- Access logs
- Error rates

### Cost Monitoring

Monitor AWS costs:
- S3 storage usage
- Lambda invocations
- Bedrock API calls
- Data transfer

## Troubleshooting

### Build Failures

**Issue**: TypeScript compilation errors

**Solution**:
```bash
npm run build
# Fix any TypeScript errors locally first
```

**Issue**: Missing dependencies

**Solution**:
```bash
npm ci
npm run build
```

### Backend Deployment Failures

**Issue**: Bedrock permissions denied

**Solution**:
1. Go to Lambda function IAM role
2. Add inline policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "bedrock:InvokeModel",
      "Resource": "*"
    }
  ]
}
```

**Issue**: S3 access denied

**Solution**:
1. Verify Lambda execution role has S3 permissions
2. Check bucket policy allows Lambda access

### Runtime Errors

**Issue**: CORS errors

**Solution**:
1. Update S3 bucket CORS configuration
2. Verify API Gateway CORS settings
3. Check Amplify hosting domain is allowed

**Issue**: Altar generation timeout

**Solution**:
1. Increase Lambda timeout (default 30s)
2. Check Bedrock model availability
3. Verify network connectivity

## Environment-Specific Configuration

### Development Environment

```bash
# Use sandbox for quick testing
npx ampx sandbox

# Frontend dev server
npm run dev
```

### Staging Environment

Create a staging branch and deploy:

```bash
git checkout -b staging
git push origin staging
```

Connect staging branch in Amplify Console.

### Production Environment

Use `main` branch for production:

```bash
git checkout main
git push origin main
```

## Rollback Procedure

If deployment fails:

1. **Via Amplify Console**:
   - Go to deployments
   - Click "Redeploy" on previous successful version

2. **Via Git**:
   ```bash
   git revert HEAD
   git push origin main
   ```

## Security Checklist

- [ ] HTTPS enabled (automatic with Amplify)
- [ ] S3 bucket encryption enabled
- [ ] Lambda functions use least privilege IAM roles
- [ ] API rate limiting configured
- [ ] Content Security Policy headers set
- [ ] CORS properly configured
- [ ] No sensitive data in localStorage
- [ ] Input validation on backend

## Performance Optimization

### CloudFront CDN

Amplify automatically uses CloudFront. Verify:
- Cache headers are set correctly
- Images are cached appropriately
- Gzip compression enabled

### S3 Lifecycle Policies

Set up automatic cleanup:

1. Go to S3 bucket → Management → Lifecycle rules
2. Create rule to delete objects older than 90 days
3. Or transition to cheaper storage class

### Lambda Optimization

- Monitor cold start times
- Consider provisioned concurrency for production
- Optimize function memory allocation

## Maintenance

### Regular Tasks

- Monitor CloudWatch logs weekly
- Review AWS costs monthly
- Update dependencies quarterly
- Test backup/restore procedures

### Updating the Application

1. Make changes locally
2. Test thoroughly
3. Commit and push to Git
4. Amplify auto-deploys on push
5. Monitor deployment in console
6. Run smoke tests

## Support and Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Project GitHub Repository](https://github.com/your-repo/altar)

## Cost Estimation

Approximate monthly costs (varies by usage):

- **Amplify Hosting**: $0.15/GB stored + $0.15/GB served
- **Lambda**: First 1M requests free, then $0.20/1M requests
- **S3**: $0.023/GB stored + $0.09/GB transfer
- **Bedrock**: Varies by model (~$0.02-0.05 per image)

**Estimated cost for 1000 altars/month**: $10-30 USD

## Next Steps

After successful deployment:

1. Set up custom domain (optional)
2. Configure monitoring alerts
3. Implement analytics (optional)
4. Set up automated backups
5. Create disaster recovery plan
