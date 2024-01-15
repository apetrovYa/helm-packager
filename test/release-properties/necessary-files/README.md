# chart

A demo chart.

## Parameters

### Global Parameters

| Name                  | Description                                                                    | Value      |
| --------------------- | ------------------------------------------------------------------------------ | ---------- |
| `global.storageClass` | Provide the StorageClass name                                                  | `standard` |
| `global.enabled`      | Use this key to have conditional on either include the dependency chart or not | `false`    |

### Common parameters

| Name                  | Description                                                                                           | Value   |
| --------------------- | ----------------------------------------------------------------------------------------------------- | ------- |
| `nameOverride`        | Provide a prefix to partially override the lib.name in the local templates                            | `""`    |
| `fullnameOverride`    | Provide a name to override completely the lib.name in the local templates                             | `""`    |
| `commonLabels`        | Provide a map of key/value pairs of labels to be applied to all resources in the local templates      | `{}`    |
| `commonAnnotations`   | Provide a map of key/value pairs of annotations to be applied to all resources in the local templates | `{}`    |
| `limitRanges.enabled` | Enable default resources parameters for all pods                                                      | `false` |
| `limitRanges.limits`  | Specify a list of default values for required resources                                               | `{}`    |

### Elasticsearch

| Name                                             | Description                                   | Value    |
| ------------------------------------------------ | --------------------------------------------- | -------- |
| `elasticsearch.clusterName`                      | Specify the name of the Elasticsearch cluster | `space`  |
| `elasticsearch.master.resources.limits.cpu`      | Specify the maximum CPU to use                | `1000m`  |
| `elasticsearch.master.resources.limits.memory`   | Specify maximum Memory to use                 | `1024Mi` |
| `elasticsearch.master.resources.requests.cpu`    | Specify minimum CPU to use                    | `1000m`  |
| `elasticsearch.master.resources.requests.memory` | Specify minimum Memory to use                 | `1024Mi` |
| `elasticsearch.master.heapSize`                  | Specify how much memory to allocate as heap   | `512m`   |
| `elasticsearch.master.persistence.size`          | Specify the disk size                         | `10Gi`   |

### Minio

| Name                                           | Description                                                                                                            | Value                                 |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `minio.resources.limits.cpu`                   | Specify the maximum CPU to use                                                                                         | `1000m`                               |
| `minio.resources.limits.memory`                | Specify the maximum Memory to use                                                                                      | `1024Mi`                              |
| `minio.resources.requests.cpu`                 | Specify the minimum CPU to use                                                                                         | `1000m`                               |
| `minio.resources.requests.memory`              | Specify the minimum Memory to use                                                                                      | `1024Mi`                              |
| `minio.auth.rootUser`                          | Specify the name of the administrator user                                                                             | `admin`                               |
| `minio.auth.rootPassword`                      | Specify the password of the administrator user                                                                         | `password`                            |
| `minio.defaultBuckets`                         | Specify the list of buckets to create (note: separate the bucket names with comma)                                     | `space-data,space-packages,space-vcs` |
| `minio.persistence.size`                       | Specify the size of the disk to use                                                                                    | `10Gi`                                |
| `minio.provisioning.enabled`                   | Enable the provisioning of users, groups and permission mappings                                                       | `true`                                |
| `minio.provisioning.users[0].username`         | Specify the username of a new user to create. Notice that this is the Unique Access Key for programmatic access        | `spaceServiceAccount`                 |
| `minio.provisioning.users[0].password`         | Specify the password of a new user to create. Notice that this is the corresponding Secret Key for programmatic access | `password`                            |
| `minio.provisioning.groups[0].name`            | Specify the name of the main functional group                                                                          | `space`                               |
| `minio.provisioning.groups[0].members`         | Specify the username of a user to add to the group. It must be one of minio.provisioning.users users                   | `["spaceServiceAccount"]`             |
| `minio.provisioning.groups[0].policies`        | Specify the permission level to assign to the group and all its members. Follow the least privilege principle          | `["readwrite"]`                       |
| `minio.provisioning.resources.limits.cpu`      | Specify the maximum CPU to use                                                                                         | `200m`                                |
| `minio.provisioning.resources.limits.memory`   | Specify the maximum Memory to use                                                                                      | `128Mi`                               |
| `minio.provisioning.resources.requests.cpu`    | Specify the minimum CPU to use                                                                                         | `200m`                                |
| `minio.provisioning.resources.requests.memory` | Specify the minimum Memory to use                                                                                      | `128Mi`                               |

### Postgresql

| Name                                           | Description                                            | Value                 |
| ---------------------------------------------- | ------------------------------------------------------ | --------------------- |
| `postgresql.auth.enablePostgresUser`           | Create a password for root user of the database server | `true`                |
| `postgresql.auth.postgresPassword`             | Specify the password for the "postgres" admin user.    | `password`            |
| `postgresql.auth.username`                     | Specify the name for a custom user                     | `spaceServiceAccount` |
| `postgresql.auth.password`                     | Specify the password for the custom user               | `password`            |
| `postgresql.auth.database`                     | Specify the name for a custom database to create       | `space`               |
| `postgresql.primary.resources.limits.memory`   | Specify the maximum CPU to use                         | `1024Mi`              |
| `postgresql.primary.resources.limits.cpu`      | Specify the maximum Memory to use                      | `1000m`               |
| `postgresql.primary.resources.requests.memory` | Specify the minimum CPU to use                         | `1024Mi`              |
| `postgresql.primary.resources.requests.cpu`    | Specify the minimum CPU to use                         | `1000m`               |
| `postgresql.primary.persistence.size`          | Specify the disk size                                  | `10Gi`                |

### Redis

| Name                                     | Description                       | Value    |
| ---------------------------------------- | --------------------------------- | -------- |
| `redis.master.resources.limits.cpu`      | Specify the maximum CPU to use    | `1000m`  |
| `redis.master.resources.limits.memory`   | Specify the maximum Memory to use | `1024Mi` |
| `redis.master.resources.requests.cpu`    | Specify the minimum CPU to use    | `1000m`  |
| `redis.master.resources.requests.memory` | Specify the minimum Memory to use | `1024Mi` |
| `redis.master.persistence.size`          | Specify the disk size             | `10Gi`   |

### Mailhog

| Name                                                        | Description                                                                                                                     | Value                    |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| `mailhog.image.registry`                                    | Specify the container registry                                                                                                  | `docker.io`              |
| `mailhog.image.repository`                                  | Specify the container repository                                                                                                | `mailhog/mailhog`        |
| `mailhog.image.tag`                                         | Specify the container version                                                                                                   | `v1.0.1`                 |
| `mailhog.image.pullPolicy`                                  | Specify the image download policy                                                                                               | `Always`                 |
| `mailhog.image.pullSecrets`                                 | Specify the secret name that contains registry credentials                                                                      | `[]`                     |
| `mailhog.replicaCount`                                      | Specify how many replicas to create                                                                                             | `1`                      |
| `mailhog.podLabels`                                         | Specify extra labels                                                                                                            | `{}`                     |
| `mailhog.podAnnotations`                                    | Specify extra annotations                                                                                                       | `{}`                     |
| `mailhog.resources.requests.cpu`                            | Specify the maximum CPU to use                                                                                                  | `500m`                   |
| `mailhog.resources.requests.memory`                         | Specify the maximum Memory to use                                                                                               | `512Mi`                  |
| `mailhog.resources.limits.cpu`                              | Specify the minimum CPU to use                                                                                                  | `500m`                   |
| `mailhog.resources.limits.memory`                           | Specify the minimum Memory to use                                                                                               | `512Mi`                  |
| `mailhog.service.ports.http`                                | Specify the port number for the Web UI                                                                                          | `8025`                   |
| `mailhog.service.ports.smtp`                                | Specify the port number for the SMTP server                                                                                     | `1025`                   |
| `mailhog.service.annotations`                               | Additional custom annotations                                                                                                   | `{}`                     |
| `mailhog.ingress.enabled`                                   | Specify weather to create an ingress                                                                                            | `true`                   |
| `mailhog.ingress.pathType`                                  | Specify the path type for ingress                                                                                               | `ImplementationSpecific` |
| `mailhog.ingress.hostname`                                  | Specify the ingress hostname for ingress                                                                                        | `mail.app.tld`           |
| `mailhog.ingress.annotations`                               | Specify the annotations for ingress                                                                                             | `{}`                     |
| `mailhog.ingress.tls`                                       | Specify the TLS for ingress                                                                                                     | `false`                  |
| `mailhog.ingress.path`                                      | Specify the array for ingress                                                                                                   | `/`                      |
| `mailhog.ingress.extraPaths`                                | Specify the extra paths for ingress                                                                                             | `[]`                     |
| `mailhog.ingress.extraTLS`                                  | Specify the extra TLS configuration for ingress                                                                                 | `[]`                     |
| `mailhog.ingress.secret`                                    | Specify the external secret name for the main hostname                                                                          | `""`                     |
| `mailhog.ingress.ingressClassName`                          | Specify the name of the controller that will handle the Ingress (Kubernetes 1.18+)                                              | `""`                     |
| `mailhog.ingress.selfSigned`                                | Create a TLS secret for this ingress record using self-signed certificates generated by Helm                                    | `false`                  |
| `mailhog.ingress.extraRules`                                | Additional rules to be covered with this ingress record                                                                         | `[]`                     |
| `mailhog.serviceAccount.create`                             | Specify whether a ServiceAccount should be created                                                                              | `false`                  |
| `mailhog.serviceAccount.name`                               | Specify the name of the service account to use. If not set and create is true, a name is generated using the fullname template. | `""`                     |
| `mailhog.serviceAccount.automountServiceAccountToken`       | Specify weather to automount service account token for the server service account                                               | `true`                   |
| `mailhog.serviceAccount.annotations`                        | Specify the annotations for service account. Evaluated as a template. Only used if `create` is `true`.                          | `{}`                     |
| `mailhog.podSecurityContext.enabled`                        | Enable pods' Security Context                                                                                                   | `true`                   |
| `mailhog.podSecurityContext.fsGroup`                        | Set pod's Security Context fsGroup                                                                                              | `10001`                  |
| `mailhog.containerSecurityContext.enabled`                  | Enable Security Context                                                                                                         | `true`                   |
| `mailhog.containerSecurityContext.runAsUser`                | Specify the ID of the user                                                                                                      | `10001`                  |
| `mailhog.containerSecurityContext.runAsNonRoot`             | Allow the container to run as not root                                                                                          | `true`                   |
| `mailhog.containerSecurityContext.allowPrivilegeEscalation` | Allow the container to with elevated permissions                                                                                | `false`                  |
| `mailhog.containerSecurityContext.readOnlyRootFilesystem`   | Allow the root file system to be read-only                                                                                      | `true`                   |
| `mailhog.containerSecurityContext.capabilities.drop`        | Specify what syscall to not allow                                                                                               | `["NET_RAW","ALL"]`      |
| `mailhog.livenessProbe.enabled`                             | Enable livenessProbe                                                                                                            | `true`                   |
| `mailhog.livenessProbe.initialDelaySeconds`                 | Initial delay seconds for livenessProbe                                                                                         | `60`                     |
| `mailhog.livenessProbe.periodSeconds`                       | Period seconds for livenessProbe                                                                                                | `30`                     |
| `mailhog.livenessProbe.timeoutSeconds`                      | Timeout seconds for livenessProbe                                                                                               | `30`                     |
| `mailhog.livenessProbe.successThreshold`                    | Success threshold for livenessProbe                                                                                             | `1`                      |
| `mailhog.livenessProbe.failureThreshold`                    | Failure threshold for livenessProbe                                                                                             | `5`                      |
| `mailhog.readinessProbe.enabled`                            | Enable readinessProbe                                                                                                           | `true`                   |
| `mailhog.readinessProbe.initialDelaySeconds`                | Initial delay seconds for readinessProbe                                                                                        | `60`                     |
| `mailhog.readinessProbe.periodSeconds`                      | Period seconds for readinessProbe                                                                                               | `10`                     |
| `mailhog.readinessProbe.timeoutSeconds`                     | Timeout seconds for readinessProbe                                                                                              | `30`                     |
| `mailhog.readinessProbe.failureThreshold`                   | Failure threshold for readinessProbe                                                                                            | `5`                      |
| `mailhog.readinessProbe.successThreshold`                   | Success threshold for readinessProbe                                                                                            | `1`                      |
