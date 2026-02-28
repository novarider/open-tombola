# Deployment Troubleshooting Guide

This guide provides solutions for common deployment issues when setting up Tombola on Ionos Cloud.

## Table of Contents

1. [Terraform Issues](#terraform-issues)
2. [Infrastructure Issues](#infrastructure-issues)
3. [Application Issues](#application-issues)
4. [Database Issues](#database-issues)
5. [SSL/HTTPS Issues](#ssltls-issues)
6. [Network Issues](#network-issues)
7. [Docker Issues](#docker-issues)
8. [Performance Issues](#performance-issues)

---

## Terraform Issues

### Issue: "Provider not found" error

**Symptoms**: Error about ionoscloud provider not found

**Solution**:
```bash
# Reinitialize Terraform
cd apps/deployment/src
rm -rf .terraform
terraform init

# Or using Nx:
nx initialize deployment
```

### Issue: Authentication failure with Ionos Cloud

**Symptoms**: 
```
Error: Failed to authenticate with Ionos Cloud
```

**Solution**:
1. Verify credentials in `terraform.tfvars`
2. Check Ionos Cloud API credentials are valid
3. Ensure credentials have proper permissions
4. Try manually authenticating:
```bash
curl -u "username:password" https://api.ionos.com/auth/token
```

### Issue: Invalid configuration errors

**Symptoms**: Various validation errors in `terraform plan`

**Solution**:
```bash
# Validate configuration syntax
cd apps/deployment/src
terraform validate

# Format files correctly
terraform fmt -recursive

# Check for typos in variables.tf and main.tf
```

### Issue: State file lock

**Symptoms**: "Resource already exists" or "Timeout waiting for lock"

**Solution**:
```bash
# Check for concurrent operations
terraform show

# Force unlock (use with caution!)
terraform force-unlock <LOCK_ID>

# Or view lock info:
cat .terraform/terraform.tfstate.d/<env>/.terraform.tfstate
```

---

## Infrastructure Issues

### Issue: VMs not starting

**Symptoms**: VMs stuck in "Initializing" or "Error" state

**Solution**:
1. Check Ionos Cloud Dashboard for error details
2. Verify datacenter has adequate resources
3. Check firewall rules aren't blocking initialization
4. Wait longer (VMs can take 10-15 minutes)
5. If persistent, destroy and recreate:
```bash
terraform destroy -target=ionoscloud_server.api
terraform apply -target=ionoscloud_server.api
```

### Issue: Cannot SSH into VMs

**Symptoms**: Connection timeout or refused

**Solution**:
1. Verify public IP assignment:
```bash
terraform output deployment_info
```

2. Check security groups allow SSH (port 22)
3. Verify root password is correct
4. Try using IP instead of hostname:
```bash
ssh -i ~/.ssh/id_rsa root@<PUBLIC_IP>
```

5. Check if VM is actually running in Ionos Dashboard

### Issue: No public IP assigned

**Symptoms**: VMs have only private IPs

**Solution**:
```bash
# Update Terraform to allocate public IPs
# In main.tf, verify NICs are on public LAN:

resource "ionoscloud_server" "api" {
  # ...
  nic {
    lan = ionoscloud_lan.public.id  # This should be public LAN
    dhcp = true
  }
}

# Then apply:
terraform apply
```

---

## Application Issues

### Issue: API container won't start

**Symptoms**: Container exits immediately

**Solution**:
1. Check logs:
```bash
docker logs tombola-api
```

2. Verify environment variables:
```bash
docker run -e NODE_ENV=production ... tombola-api
```

3. Check database connectivity:
```bash
docker logs -f tombola-api | grep -i "database\|connection"
```

4. Verify built files exist:
```bash
ls -la apps/api/dist/
```

### Issue: Frontend shows blank page

**Symptoms**: Browser receives HTML but no JavaScript

**Solution**:
1. Check browser console for errors
2. Verify Nginx is serving static files:
```bash
curl -v http://localhost/index.html
```

3. Check file permissions:
```bash
ls -la /usr/share/nginx/html/
```

4. Verify build output:
```bash
ls -la dist/apps/frontend/browser/
```

### Issue: API returns 502 Bad Gateway

**Symptoms**: Nginx can't reach backend

**Solution**:
1. Verify API is running:
```bash
docker ps | grep api
```

2. Check API logs:
```bash
docker logs tombola-api
```

3. Verify Nginx config:
```bash
nginx -t
```

4. Check network connectivity:
```bash
curl http://api:3333/health  # From frontend container
```

### Issue: Request timeout

**Symptoms**: Requests hang or timeout

**Solution**:
1. Check Nginx timeouts in configuration
2. Verify API is responsive:
```bash
ssh root@<api-ip>
curl http://localhost:3333/health
```

3. Check system resources:
```bash
top -b -n 1 | head -20
free -h
df -h
```

---

## Database Issues

### Issue: Cannot connect to PostgreSQL

**Symptoms**: "Connection refused" or "could not translate host name"

**Solution**:
1. Verify PostgreSQL is running:
```bash
docker ps | grep postgres
```

2. Check credentials in DATABASE_URL:
```bash
# Connection string should be:
postgresql://user:password@hostname:5432/dbname
```

3. Test connection manually:
```bash
psql postgresql://tombola:password@localhost:5432/tombola
```

4. Check firewall allows port 5432:
```bash
netstat -tlnp | grep 5432
```

### Issue: Database initialization failed

**Symptoms**: Tables don't exist or migrations not applied

**Solution**:
1. Check if database exists:
```bash
psql -U postgres -l
```

2. Re-run initialization script:
```bash
psql -U tombola -d tombola -f init-db.sql
```

3. Check script output for errors:
```bash
psql -U tombola -d tombola -f init-db.sql 2>&1 | tee db-init.log
```

### Issue: Out of disk space

**Symptoms**: Database can't write, logs error about no space

**Solution**:
1. Check disk usage:
```bash
df -h
```

2. Find large files:
```bash
du -sh /* | sort -rh
```

3. Clean up:
```bash
# Remove old logs
rm -f /var/log/*.log.*

# Clean Docker:
docker system prune
```

---

## SSL/TLS Issues

### Issue: Certificate validation fails

**Symptoms**: Browser warning about untrusted certificate

**Solution**:
1. Verify certificate is valid:
```bash
openssl x509 -in /etc/letsencrypt/live/domain/fullchain.pem -noout -text
```

2. Check certificate dates:
```bash
openssl x509 -in /etc/letsencrypt/live/domain/fullchain.pem -noout -dates
```

3. Verify Nginx is using correct cert:
```bash
grep "ssl_certificate" /etc/nginx/conf.d/default.conf
```

### Issue: Certificate renewal failed

**Symptoms**: Certificate expires or renewal doesn't work

**Solution**:
1. Check certbot logs:
```bash
tail -f /var/log/letsencrypt/letsencrypt.log
```

2. Test renewals:
```bash
certbot renew --dry-run
```

3. Manually renew:
```bash
certbot renew --force-renewal
```

### Issue: Mixed content warning

**Symptoms**: Browser shows mixed content warning with HTTPS

**Solution**:
1. Ensure all resources are HTTPS in frontend
2. Update backend URL in .env:
```bash
API_URL=https://api.your-domain.com
```

3. Configure Nginx to set X-Forwarded-Proto:
```nginx
proxy_set_header X-Forwarded-Proto $scheme;
```

---

## Network Issues

### Issue: Cannot reach external services

**Symptoms**: API can't reach Stripe API or send emails

**Solution**:
1. Check outbound firewall rules:
```bash
# In Ionos Dashboard, verify outbound rules allow HTTPS (443)
```

2. Test connectivity:
```bash
# From VM:
curl -v https://api.stripe.com
```

3. Check routing:
```bash
ip route
```

### Issue: DNS not resolving

**Symptoms**: "cannot resolve" errors

**Solution**:
1. Check DNS configuration:
```bash
cat /etc/resolv.conf
```

2. Test DNS:
```bash
nslookup your-domain.com
dig your-domain.com
```

3. Check Ionos Cloud DNS settings:
   - Verify A records point to correct IPs
   - Allow time for propagation (up to 48 hours)
   - Use nslookup to verify:
```bash
nslookup your-domain.com 8.8.8.8  # Google DNS
```

### Issue: Firewall blocking traffic

**Symptoms**: Host unreachable or timeout errors

**Solution**:
1. Review firewall rules in Ionos Dashboard
2. Verify inbound rules:
   - Port 22 (SSH)
   - Port 80 (HTTP)
   - Port 443 (HTTPS)
   - Port 3333 (API - for private access)

3. Test ports:
```bash
nc -zv <ip> 22
nc -zv <ip> 80
nc -zv <ip> 443
```

---

## Docker Issues

### Issue: Image build fails

**Symptoms**: "docker build" command fails

**Solution**:
1. Check build output for specific errors
2. Build applications first:
```bash
nx build api --configuration=production
nx build frontend --configuration=production
```

3. Try step-by-step:
```bash
docker build --no-cache -t tombola-api apps/api/
```

### Issue: Container exits immediately

**Symptoms**: Container runs then stops

**Solution**:
1. Check exit code:
```bash
docker inspect <container-id> | grep ExitCode
```

2. View logs:
```bash
docker logs <container-id>
```

3. Run interactively to debug:
```bash
docker run -it tombola-api /bin/sh
```

### Issue: Out of disk space for Docker

**Symptoms**: "no space left on device"

**Solution**:
```bash
# Clean up Docker
docker system prune -a --volumes

# Or more surgical:
docker image prune
docker container prune
docker volume prune
```

---

## Performance Issues

### Issue: Slow API responses

**Symptoms**: API takes >5 seconds to respond

**Solution**:
1. Check API logs for slow queries
2. Monitor system resources:
```bash
htop
```

3. Check database performance:
```bash
# Connect to PostgreSQL and check:
\d pg_stat_statements
```

4. Optimize Nginx:
```nginx
# In nginx.conf
proxy_buffer_size 32k;
proxy_buffers 8 32k;
proxy_busy_buffers_size 64k;
```

### Issue: Memory leak

**Symptoms**: Memory usage increases over time

**Solution**:
1. Monitor memory:
```bash
free -h
watch -n 1 'free -h'
```

2. Check Node.js for leaks:
```bash
docker exec tombola-api node -e "console.log(process.memoryUsage())"
```

3. Restart container to free memory:
```bash
docker restart tombola-api
```

---

## Getting Help

If you're stuck:

1. **Check logs first**:
```bash
docker logs -f <container-name>
journalctl -xe
tail -f /var/log/syslog
```

2. **Review Terraform state**:
```bash
terraform state show
terraform state list
```

3. **Verify infrastructure in Ionos Dashboard**:
   - Check VM status
   - Review firewall rules
   - Monitor resource usage

4. **Test connectivity**:
```bash
curl -v http://api:3333/health
curl -v http://frontend/
```

5. **Check documentation**:
   - [Ionos Cloud Docs](https://docs.ionos.com)
   - [Terraform Docs](https://www.terraform.io/docs)
   - [Docker Docs](https://docs.docker.com)

---

**Updated**: 2026-02-28
**Version**: 1.0
