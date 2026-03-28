# Open-tombola Kubernetes Setup files

These files describe how open-tombola can be setup in a Kubernetes (k8s) environment.

## Components

- Database Deployment
- Backend Deployment
- Frontend Deployment
- Database Service
- Backend Service
- Frontend Service
- Backend HTTPRoute
- Frontend HTTPRoute
- Gateway

### Gateway

Envoy Gateway is used to simplify http routing and implementing HTTPS

To install it run following command

```
helm install eg oci://docker.io/envoyproxy/gateway-helm --version v1.7.1 -n envoy-gateway-system --create-namespace
```

After that it can be configured, for details see [envoy-http-routing.yaml](envoy-http-routing.yml)

## Secret Files

These two file are not part of the repository to prevent disclosure. Create them with following templates

### [.env.api](.env.api)

```env
NODE_ENV=           # node environment
HOST=               # IP to serve API on
PORT=               # Port to serve API on
API_KEY_STRIPE=     # Stripe API Key
DB_HOST=            # DB Hostname
DB_PORT=            # DB Port
DB_USERNAME=        # DB Username
DB_PASSWORD=        # DB Password
STRIPE_PRICE_ID=    # Stripe ticket product id
FRONTEND_BASE_URL=  # Frontendbase URL (needed for redirects)
```

### [.env.database](.env.database)

```env
POSTGRES_USER=      # DB Username
POSTGRES_PASSWORD=  # DB Password
POSTGRES_DB=        # Open tombola DB name
```
