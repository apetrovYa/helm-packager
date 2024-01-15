{{/* vim: set filetype=mustache: */}}

{{/*
Return the deployment environment.
*/}}
{{- define "lib.environment" -}}
{{- default "production" .Values.global.environment }}
{{- end }}
{{/*
Return a valid namespace name.
Constraint:
.Values.namespaceOverride has precedence over the .Release.namespace
*/}}
{{- define "lib.namespace" -}}
{{ include "common.names.namespace" $ }}
{{- end }}
{{/*
Return a valid name prefix.
*/}}
{{- define "lib.prefixName" -}}
{{ include "common.names.fullname" $ }}
{{- end }}
{{/*
Return a normalized application name.
It is constructed by a prefix and a suffix. The prefix structure is defined by the common
convention that is based on the following objects ".Release" and ".Chart".
*/}}
{{- define "lib.appName" -}}
{{ include "lib.prefixName" $ -}}-{{ default "app" .Values.name }}
{{- end -}}
{{/*
Return a valid set of labels prefix.
*/}}
{{- define "lib.labels" -}}
{{ include "common.labels.standard" $ }}
{{ if .Values.commonLabels }}
{{ include "common.tplvalues.render" ( dict "value" .Values.commonLabels "context" $ ) }}
{{ end }}
{{- end -}}
{{/*
Return a valid set of labels prefix.
*/}}
{{- define "lib.annotations" -}}
{{- if .Values.commonAnnotations }}
{{ include "common.tplvalues.render" ( dict "value" .Values.commonAnnotations "context" $ ) }}
{{- end }}
{{- end -}}
{{/*
Return a valid set of labels to use as spec.selector.matchLabels.
*/}}
{{- define "lib.matchLabels" -}}
{{ include "lib.labels" . }}
{{- end }}
{{/*
Return a valid component name.
*/}}
{{- define "lib.componentName" -}}
{{ .Values.name | default "app" }}
{{- end }}
{{/*
Return a proper heap integer value. Only Mebibytes (Mi) are accepted.

The function accepts a valid memory value (example: 2048Mi). If the input is not valid
default 1024Mi is assumed to assigned.

Usage:
 {{- include "lib.calculate.heap" (dict "memory" "2048Mi") -}}
*/}}
{{- define "lib.calculate.heap" -}}
{{- $givenMemory := .memory }}
{{- if not ( contains "Mi" $givenMemory )  }}
{{- fail "Memory values are not expressed as Mebibytes (Mi). Expected example: 1024Mi." }}
{{- end }}
{{- default "1024" ( div ( $givenMemory | trimAll "Mi" ) 2 ) }}
{{- end }}
{{/*
Return a -Xms$Intm -Xmx$Intm value.
Usage:
    {{- include "lib.java_heap" (dict "memory" "2048Mi") -}}
{{-  }}
*/}}
{{- define "lib.java_heap" }}
{{- $availableRam := .memory }}
{{- printf "-Xms%sm -Xmx%sm" (include "lib.calculate.heap" (dict "memory" $availableRam )) (include "lib.calculate.heap" (dict "memory" $availableRam )) -}}
{{- end }}

{{/*
Return a formatted image string as follows: registry_url/repository_name/image_name:tag
Usage:
    {{- include "lib.image" (dict "registry" "docker.io" "repository" "elasticsearch" "tag" "6.8.5" ) -}}
Pre_condition: repository, tag are not empty strings.
*/}}
{{- define "lib.image" }}
{{- $registry := .registry | default "docker.io" | toString }}
{{- $repository := .repository | toString }}
{{- $tag := .tag | toString }}
{{- printf "%s/%s:%s" $registry $repository $tag }}
{{- end }}
