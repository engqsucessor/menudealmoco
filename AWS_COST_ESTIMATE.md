# AWS Cost Estimation - MenuDealMoco

**Generated:** 2025-09-30
**Region:** eu-west-1 (Ireland)
**Instance ID:** i-055b5fe2190a7cefe

---

## Infrastructure Summary

| Resource | Specification | Size/Type |
|----------|--------------|-----------|
| **EC2 Instance** | t3.micro | 2 vCPU, 1GB RAM |
| **EBS Volume** | gp3 | 8GB |
| **ECR Storage** | Docker Images | 1.735GB total |
| **Secrets Manager** | JWT Secret | 1 secret |
| **SSL Certificate** | Let's Encrypt | Free |
| **Data Transfer** | Outbound | ~10-50GB/month (estimated) |

---

## Cost Breakdown

### 1. EC2 Instance (t3.micro)

**Free Tier (First 12 months):**
- ✅ **750 hours/month FREE** (covers 24/7 operation)
- Cost: **$0.00/month**

**After Free Tier:**
- Hourly rate: $0.0104/hour
- Monthly cost (730 hours): **$7.59/month**
- Annual cost: **$91.08/year**

---

### 2. EBS Storage (gp3 - 8GB)

**Free Tier (First 12 months):**
- ✅ **30GB FREE** (your 8GB is covered)
- Cost: **$0.00/month**

**After Free Tier:**
- Rate: $0.08/GB/month
- Monthly cost: **$0.64/month**
- Annual cost: **$7.68/year**

---

### 3. ECR (Elastic Container Registry)

**Storage:**
- Backend image: 0.85GB
- Frontend image: 0.89GB
- Total: 1.735GB
- Rate: $0.10/GB/month (first 50GB)
- **Monthly cost: $0.17/month**
- **Annual cost: $2.04/year**

**Data Transfer:**
- Pulling images to EC2 (same region): **FREE**

---

### 4. AWS Secrets Manager

**Secret Storage:**
- 1 secret (menudealmoco/jwt-secret)
- Rate: $0.40/secret/month
- **Monthly cost: $0.40/month**
- **Annual cost: $4.80/year**

**API Calls:**
- First 10,000 calls: FREE
- Container restarts fetch secret ~2-4 times/month
- Cost: **$0.00/month**

---

### 5. Data Transfer

**Free Tier:**
- ✅ **100GB/month outbound FREE** (applies always, not just first year)

**Estimated Usage:**
- Average restaurant page: ~500KB (includes images, API calls)
- 100 daily visitors × 5 pages = 500 page loads/day
- Monthly data transfer: ~7.5GB/month
- **Cost: $0.00/month** (well within free tier)

**If you exceed 100GB:**
- $0.09/GB for next 10TB
- 150GB usage = 50GB overage = **$4.50/month**

---

## Total Monthly Costs

### Year 1 (With Free Tier)
| Service | Cost |
|---------|------|
| EC2 t3.micro | $0.00 ✅ |
| EBS 8GB gp3 | $0.00 ✅ |
| ECR 1.735GB | $0.17 |
| Secrets Manager | $0.40 |
| Data Transfer | $0.00 ✅ |
| **TOTAL** | **$0.57/month** |
| **Annual** | **$6.84/year** |

### After Year 1 (No Free Tier)
| Service | Cost |
|---------|------|
| EC2 t3.micro | $7.59 |
| EBS 8GB gp3 | $0.64 |
| ECR 1.735GB | $0.17 |
| Secrets Manager | $0.40 |
| Data Transfer | $0.00 ✅ |
| **TOTAL** | **$8.80/month** |
| **Annual** | **$105.60/year** |

---

## Cost Comparison

| Hosting Option | Monthly Cost | Annual Cost | Notes |
|----------------|-------------|-------------|-------|
| **AWS (Year 1)** | $0.57 | $6.84 | Free Tier benefits |
| **AWS (Year 2+)** | $8.80 | $105.60 | Full pricing |
| **Hetzner VPS** | €10.00 (~$10.90) | €120 (~$130.80) | From hosting.txt |
| **Railway.app** | ~$5-20 | ~$60-240 | Usage-based |
| **DigitalOcean** | $6.00 | $72.00 | Basic droplet |

---

## Cost Optimization Recommendations

### Immediate (No Impact)
1. ✅ **Already optimized:** Using t3.micro (smallest production instance)
2. ✅ **Already optimized:** Minimal EBS storage (8GB)
3. ✅ **Already optimized:** Docker multi-stage builds keep images small

### If Costs Increase

1. **Switch to Lightsail** ($3.50/month for similar specs)
   - Fixed pricing, easier to predict
   - Includes data transfer allowance
   - Less flexible but more cost-effective for small apps

2. **Implement CloudFront CDN** (Free Tier: 1TB outbound/month)
   - Reduces data transfer costs
   - Improves performance globally
   - Caches static assets

3. **Schedule EC2 downtime** (if 24/7 not needed)
   - Use Lambda to start/stop instance
   - Save ~70% if only running business hours

4. **Move secrets to Parameter Store** (Free alternative)
   - AWS Systems Manager Parameter Store
   - FREE for standard parameters
   - Save $0.40/month

---

## Hidden Costs to Watch

### Unlikely but Possible
- **DDoS attack:** Could spike data transfer costs (mitigate with AWS Shield Basic - free)
- **Database growth:** If SQLite grows beyond 8GB, need larger EBS volume
- **Image storage growth:** More restaurant photos = larger ECR images
- **High traffic spike:** Could exceed 100GB free data transfer

### Recommended Monitoring
```bash
# Set up AWS Budgets (FREE)
aws budgets create-budget \
  --account-id <your-account-id> \
  --budget BudgetName=MenuDealMoco,BudgetLimit={Amount=15,Unit=USD}

# Enable cost alerts at $10 and $15 thresholds
```

---

## 3-Year Cost Projection

| Year | Monthly Avg | Annual Total | Cumulative |
|------|-------------|--------------|------------|
| Year 1 | $0.57 | $6.84 | $6.84 |
| Year 2 | $8.80 | $105.60 | $112.44 |
| Year 3 | $8.80 | $105.60 | $218.04 |

**Average over 3 years:** $72.68/year (~$6.06/month)

---

## Break-Even Analysis

**Your setup vs Hetzner (€10/month):**

- **Year 1:** AWS saves you $124.08
- **Year 2:** AWS saves you $25.20
- **Year 3:** AWS saves you $25.20

**Total 3-year savings with AWS:** $174.48

---

## Verdict

### ✅ Excellent Value
Your AWS setup is **extremely cost-effective**, especially in Year 1:

1. **First year:** $6.84 total (94% cheaper than Hetzner)
2. **Subsequent years:** $105.60/year (19% cheaper than Hetzner)
3. **Better infrastructure:** Auto-scaling capable, managed services, better security
4. **Professional setup:** IAM roles, Secrets Manager, ECR for CI/CD

### 💡 Recommendation
**Keep this AWS setup.** The Free Tier benefits are substantial, and even after Year 1, you're still getting better value than traditional VPS hosting with more professional infrastructure.

---

## Cost Verification Commands

```bash
# Check current month's costs
aws ce get-cost-and-usage \
  --time-period Start=2025-09-01,End=2025-09-30 \
  --granularity MONTHLY \
  --metrics BlendedCost

# List all EC2 costs
aws ce get-cost-and-usage \
  --time-period Start=2025-09-01,End=2025-09-30 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=SERVICE

# Check Free Tier usage
# Go to: https://console.aws.amazon.com/billing/home#/freetier
```

---

## Questions?

**If your traffic grows significantly:**
- CloudFront CDN can handle 100x traffic increase with minimal cost impact
- Consider upgrading to t3.small (~$15/month) only if CPU consistently >80%

**If you want to reduce costs further:**
- Switch Secrets Manager → Parameter Store (saves $4.80/year)
- Consider AWS Lightsail for fixed pricing ($42/year for 1GB RAM instance)

**Current setup is optimal for your use case.**
