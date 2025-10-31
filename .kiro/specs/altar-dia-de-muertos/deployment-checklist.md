# Deployment Checklist

Use this checklist to ensure all deployment steps are completed successfully.

## Pre-Deployment

- [x] Production build completes without errors (`npm run build`)
- [ ] All TypeScript compilation passes
- [ ] No console errors in development
- [ ] All features tested locally
- [ ] Code committed to Git repository
- [ ] Git repository pushed to remote (GitHub/GitLab/Bitbucket)

## AWS Account Setup

- [ ] AWS account created and configured
- [ ] AWS CLI installed and configured (`aws configure`)
- [ ] IAM user has necessary permissions:
  - Amplify full access
  - S3 full access
  - Lambda full access
  - Bedrock access
  - CloudFormation access
  - IAM role creation

## Backend Deployment

- [ ] Amplify backend deployed (via Console or CLI)
- [ ] S3 bucket created and accessible
- [ ] Lambda functions deployed:
  - [ ] `uploadPhoto` function
  - [ ] `generateAltar` function
- [ ] Lambda environment variables configured:
  - [ ] `STORAGE_BUCKET_NAME` set
- [ ] Lambda IAM roles have correct permissions:
  - [ ] S3 read/write access
  - [ ] Bedrock invoke model access
- [ ] Bedrock model access requested and approved
- [ ] API endpoints configured and accessible

## Frontend Deployment

- [ ] Frontend deployed to Amplify Hosting
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic with Amplify)
- [ ] CloudFront distribution active
- [ ] amplify_outputs.json generated and included in build

## Configuration Verification

- [ ] S3 bucket CORS configured correctly
- [ ] S3 bucket encryption enabled
- [ ] Lambda timeout set appropriately (30s for generateAltar)
- [ ] Lambda memory allocation optimized
- [ ] API Gateway CORS enabled
- [ ] Environment variables set correctly

## Testing - Functional

- [ ] Application loads without errors
- [ ] Photo upload works:
  - [ ] Valid file types accepted (JPEG, PNG, WEBP)
  - [ ] Invalid file types rejected
  - [ ] File size validation works (max 10MB)
  - [ ] Image preview displays
- [ ] Food description input works:
  - [ ] Character counter displays
  - [ ] Min length validation (10 chars)
  - [ ] Max length validation (500 chars)
  - [ ] Input sanitization works
- [ ] Altar generation works:
  - [ ] Loading spinner displays
  - [ ] Altar image generates successfully
  - [ ] Generated image displays correctly
  - [ ] Error handling works for failures
- [ ] localStorage persistence works:
  - [ ] Altars save automatically
  - [ ] Altars persist after page refresh
  - [ ] Multiple altars can be saved
- [ ] Gallery view works:
  - [ ] All altars display
  - [ ] Altars sorted by date (newest first)
  - [ ] Empty state displays when no altars
  - [ ] Navigation to detail view works
- [ ] Altar detail view works:
  - [ ] Full-size image displays
  - [ ] Food description displays
  - [ ] Download button works
  - [ ] Back navigation works
- [ ] Delete functionality works:
  - [ ] Confirmation dialog appears
  - [ ] Altar removed from gallery
  - [ ] localStorage updated

## Testing - Cross-Browser

- [ ] Chrome (desktop)
- [ ] Chrome (mobile)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Safari (iOS)
- [ ] Edge (desktop)

## Testing - Responsive Design

- [ ] 320px width (small mobile)
- [ ] 375px width (iPhone)
- [ ] 768px width (tablet)
- [ ] 1024px width (desktop)
- [ ] 1920px width (large desktop)
- [ ] 2560px width (ultra-wide)

## Testing - Performance

- [ ] Page load time < 3 seconds
- [ ] Photo upload completes in reasonable time
- [ ] Altar generation completes within 30 seconds
- [ ] Images load quickly (CloudFront caching)
- [ ] No memory leaks in browser
- [ ] Smooth animations and transitions

## Testing - Error Handling

- [ ] Network errors display user-friendly messages
- [ ] Upload failures allow retry
- [ ] Generation failures allow retry
- [ ] localStorage quota exceeded handled gracefully
- [ ] Invalid inputs show validation messages
- [ ] Timeout errors handled appropriately

## Security Verification

- [ ] HTTPS enforced (automatic with Amplify)
- [ ] No sensitive data in localStorage
- [ ] Input sanitization working
- [ ] File type validation using magic numbers
- [ ] API rate limiting configured (optional)
- [ ] Content Security Policy headers set
- [ ] S3 bucket not publicly accessible
- [ ] Lambda functions use least privilege IAM roles

## Monitoring Setup

- [ ] CloudWatch logs accessible for Lambda functions
- [ ] Amplify Console monitoring configured
- [ ] Error tracking enabled
- [ ] Cost alerts configured (optional)
- [ ] Performance monitoring enabled (optional)

## Documentation

- [ ] README.md updated with deployment info
- [ ] DEPLOYMENT.md created with detailed instructions
- [ ] amplify.yml build configuration created
- [ ] Environment variables documented
- [ ] API endpoints documented

## Post-Deployment

- [ ] Smoke tests passed on production URL
- [ ] Team notified of deployment
- [ ] Deployment documented in changelog
- [ ] Rollback procedure tested (optional)
- [ ] Backup strategy implemented (optional)

## Maintenance Plan

- [ ] Regular monitoring schedule established
- [ ] Update procedure documented
- [ ] Cost monitoring in place
- [ ] Support contact information available
- [ ] Disaster recovery plan created (optional)

## Sign-Off

- [ ] Technical lead approval
- [ ] Stakeholder approval
- [ ] Production deployment completed
- [ ] Post-deployment verification completed

---

**Deployment Date**: _________________

**Deployed By**: _________________

**Production URL**: _________________

**Notes**:
