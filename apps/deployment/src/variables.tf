# Ionos Cloud Provider Configuration
variable "ionos_username" {
  description = "Ionos Cloud username"
  type        = string
  sensitive   = true
}

variable "ionos_password" {
  description = "Ionos Cloud password"
  type        = string
  sensitive   = true
}

variable "ionos_endpoint" {
  description = "Ionos Cloud API endpoint"
  type        = string
  default     = "https://api.ionos.com"
}

# Datacenter Configuration
variable "datacenter_name" {
  description = "Name of the datacenter"
  type        = string
  default     = "tombola-dc"
}

variable "data_center_location" {
  description = "Location of the datacenter (de/us/gb/fr)"
  type        = string
  default     = "de"
}

# API Server Configuration
variable "api_cores" {
  description = "Number of CPU cores for API server"
  type        = number
  default     = 2
}

variable "api_ram" {
  description = "RAM in MB for API server"
  type        = number
  default     = 2048
}

variable "api_disk_size" {
  description = "Disk size in GB for API server"
  type        = number
  default     = 20
}

variable "api_image_password" {
  description = "Root password for API server image"
  type        = string
  sensitive   = true
}

# Frontend Server Configuration
variable "frontend_cores" {
  description = "Number of CPU cores for frontend server"
  type        = number
  default     = 2
}

variable "frontend_ram" {
  description = "RAM in MB for frontend server"
  type        = number
  default     = 2048
}

variable "frontend_disk_size" {
  description = "Disk size in GB for frontend server"
  type        = number
  default     = 20
}

variable "frontend_image_password" {
  description = "Root password for frontend server image"
  type        = string
  sensitive   = true
}

# Common Configuration
variable "image_name" {
  description = "OS image name for VMs"
  type        = string
  default     = "ubuntu:latest"
}

# S3 Storage Configuration
variable "s3_bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
  default     = "tombola-backup"
}

variable "s3_region" {
  description = "Region for S3 bucket"
  type        = string
  default     = "eu-central-1"
}

# Environment variables
variable "environment" {
  description = "Environment name (dev/staging/prod)"
  type        = string
  default     = "prod"
}

variable "api_port" {
  description = "Port on which API runs"
  type        = number
  default     = 3333
}

variable "api_host" {
  description = "Host for API"
  type        = string
  default     = "0.0.0.0"
}
