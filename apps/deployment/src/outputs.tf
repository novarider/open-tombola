output "api_server_id" {
  description = "ID of the API server"
  value       = ionoscloud_server.api.id
}

output "api_server_ips" {
  description = "Public and private IPs of the API server"
  value = {
    public_ips = ionoscloud_server.api.primary_nic[0].ips
    private_ip = ionoscloud_server.api.primary_nic[1].ips
  }
}

output "frontend_server_id" {
  description = "ID of the frontend server"
  value       = ionoscloud_server.frontend.id
}

output "frontend_server_ips" {
  description = "Public and private IPs of the frontend server"
  value = {
    public_ips = ionoscloud_server.frontend.primary_nic[0].ips
    private_ip = ionoscloud_server.frontend.primary_nic[1].ips
  }
}

output "datacenter_id" {
  description = "ID of the datacenter"
  value       = ionoscloud_datacenter.main.id
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = ionoscloud_s3_bucket.tombola.name
}

output "s3_bucket_id" {
  description = "ID of the S3 bucket"
  value       = ionoscloud_s3_bucket.tombola.id
}

output "api_access_url" {
  description = "URL to access the API"
  value       = "http://${ionoscloud_server.api.primary_nic[0].ips[0]}:${var.api_port}"
}

output "frontend_access_url" {
  description = "URL to access the frontend"
  value       = "http://${ionoscloud_server.frontend.primary_nic[0].ips[0]}"
}

output "api_firewall_id" {
  description = "ID of the API firewall"
  value       = ionoscloud_firewall.api.id
}

output "frontend_firewall_id" {
  description = "ID of the frontend firewall"
  value       = ionoscloud_firewall.frontend.id
}

output "deployment_info" {
  description = "Summary of deployed resources"
  value = {
    api_server = {
      id         = ionoscloud_server.api.id
      name       = ionoscloud_server.api.name
      public_ip  = ionoscloud_server.api.primary_nic[0].ips[0]
      private_ip = ionoscloud_server.api.primary_nic[1].ips[0]
      url        = "http://${ionoscloud_server.api.primary_nic[0].ips[0]}:${var.api_port}"
      cores      = var.api_cores
      ram        = var.api_ram
    }
    frontend_server = {
      id         = ionoscloud_server.frontend.id
      name       = ionoscloud_server.frontend.name
      public_ip  = ionoscloud_server.frontend.primary_nic[0].ips[0]
      private_ip = ionoscloud_server.frontend.primary_nic[1].ips[0]
      url        = "http://${ionoscloud_server.frontend.primary_nic[0].ips[0]}"
      cores      = var.frontend_cores
      ram        = var.frontend_ram
    }
    datacenter = {
      id       = ionoscloud_datacenter.main.id
      name     = ionoscloud_datacenter.main.name
      location = ionoscloud_datacenter.main.location
    }
    storage = {
      bucket_name = ionoscloud_s3_bucket.tombola.name
      region      = ionoscloud_s3_bucket.tombola.region
    }
  }
}
