terraform {
  required_version = ">= 1.0"
  required_providers {
    ionoscloud = {
      source  = "ionos-cloud/ionoscloud"
      version = "~> 7.0"
    }
  }
}

provider "ionoscloud" {
  username = var.ionos_username
  password = var.ionos_password
  endpoint = var.ionos_endpoint
}

# Create a datacenter
resource "ionoscloud_datacenter" "main" {
  name             = var.datacenter_name
  description      = "Datacenter for Tombola Application"
  location         = var.data_center_location
  cpu_architecture = "INTEL"
}

# Create a LAN for internal communication
resource "ionoscloud_lan" "main" {
  datacenter_id = ionoscloud_datacenter.main.id
  public        = false
  name          = "tombola-lan"
}

# Create a public LAN for load balancer
resource "ionoscloud_lan" "public" {
  datacenter_id = ionoscloud_datacenter.main.id
  public        = true
  name          = "tombola-public"
}

# API Server VM
resource "ionoscloud_server" "api" {
  name              = "tombola-api"
  datacenter_id     = ionoscloud_datacenter.main.id
  cores             = var.api_cores
  ram               = var.api_ram
  cpu_family        = "INTEL_XEON"
  availability_zone = "ZONE_1"

  volume {
    name              = "api-boot-disk"
    size              = var.api_disk_size
    disk_type         = "DAS"
    availability_zone = "ZONE_1"
    bus               = "VIRTIO"
  }

  nic {
    lan  = ionoscloud_lan.public.id
    dhcp = true
  }

  nic {
    lan  = ionoscloud_lan.main.id
    dhcp = true
  }

  boot_volume = ionoscloud_volume.api_boot.id
}

# API Boot Volume
resource "ionoscloud_volume" "api_boot" {
  datacenter_id     = ionoscloud_datacenter.main.id
  name              = "api-boot-disk"
  size              = var.api_disk_size
  disk_type         = "DAS"
  availability_zone = "ZONE_1"
  bus               = "VIRTIO"
  image_name        = var.image_name
  image_password    = var.api_image_password
}

# Frontend Server VM
resource "ionoscloud_server" "frontend" {
  name              = "tombola-frontend"
  datacenter_id     = ionoscloud_datacenter.main.id
  cores             = var.frontend_cores
  ram               = var.frontend_ram
  cpu_family        = "INTEL_XEON"
  availability_zone = "ZONE_2"

  volume {
    name              = "frontend-boot-disk"
    size              = var.frontend_disk_size
    disk_type         = "DAS"
    availability_zone = "ZONE_2"
    bus               = "VIRTIO"
  }

  nic {
    lan  = ionoscloud_lan.public.id
    dhcp = true
  }

  nic {
    lan  = ionoscloud_lan.main.id
    dhcp = true
  }

  boot_volume = ionoscloud_volume.frontend_boot.id
}

# Frontend Boot Volume
resource "ionoscloud_volume" "frontend_boot" {
  datacenter_id     = ionoscloud_datacenter.main.id
  name              = "frontend-boot-disk"
  size              = var.frontend_disk_size
  disk_type         = "DAS"
  availability_zone = "ZONE_2"
  bus               = "VIRTIO"
  image_name        = var.image_name
  image_password    = var.frontend_image_password
}

# Firewall for API Server
resource "ionoscloud_firewall" "api" {
  datacenter_id = ionoscloud_datacenter.main.id
  server_id     = ionoscloud_server.api.id
  nic_id        = ionoscloud_server.api.primary_nic[0].id
  name          = "api-firewall"

  inbound_rule {
    protocol    = "TCP"
    source_ip   = "0.0.0.0/0"
    target_port = "22"
  }

  inbound_rule {
    protocol    = "TCP"
    source_ip   = "0.0.0.0/0"
    target_port = "3333"
  }

  inbound_rule {
    protocol    = "TCP"
    source_ip   = "0.0.0.0/0"
    target_port = "443"
  }

  outbound_rule {
    protocol    = "TCP"
    target_port = "443"
  }

  outbound_rule {
    protocol    = "TCP"
    target_port = "80"
  }
}

# Firewall for Frontend Server
resource "ionoscloud_firewall" "frontend" {
  datacenter_id = ionoscloud_datacenter.main.id
  server_id     = ionoscloud_server.frontend.id
  nic_id        = ionoscloud_server.frontend.primary_nic[0].id
  name          = "frontend-firewall"

  inbound_rule {
    protocol    = "TCP"
    source_ip   = "0.0.0.0/0"
    target_port = "22"
  }

  inbound_rule {
    protocol    = "TCP"
    source_ip   = "0.0.0.0/0"
    target_port = "80"
  }

  inbound_rule {
    protocol    = "TCP"
    source_ip   = "0.0.0.0/0"
    target_port = "443"
  }

  outbound_rule {
    protocol    = "TCP"
    target_port = "443"
  }

  outbound_rule {
    protocol    = "TCP"
    target_port = "80"
  }
}

# S3 Object Storage for backups and static assets
resource "ionoscloud_s3_bucket" "tombola" {
  name   = var.s3_bucket_name
  region = var.s3_region
}

# S3 Bucket versioning
resource "ionoscloud_s3_bucket_versioning" "tombola" {
  bucket = ionoscloud_s3_bucket.tombola.id
  versioning_configuration {
    status = "Enabled"
  }
}

# S3 Bucket public access configuration
resource "ionoscloud_s3_bucket_public_access_block" "tombola" {
  bucket                  = ionoscloud_s3_bucket.tombola.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
