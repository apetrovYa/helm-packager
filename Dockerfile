FROM node:21.5.0-bullseye-slim
# hadolint ignore=DL3048
LABEL MAINTAINER="Andrei Petrov [andrei.petrov@acm.org]"

SHELL ["/bin/bash", "-o", "errexit", "-o", "nounset", "-o", "pipefail", "-c"]

ENV DEBIAN_FRONTEND=noninteractive
ENV APP_DIR="/app"
ENV APP_TOOLING_DIR="/tools"
ENV HELM_CHART_DIR="/app/chart"
ENV HELM_PLUGINS="${APP_TOOLING_DIR}/helm/plugins"
ENV PATH="$PATH:${APP_TOOLING_DIR}"

WORKDIR ${APP_TOOLING_DIR}
# hadolint ignore=DL3003,DL3008,DL3015
RUN apt-get update && apt-get install -y \
    make \
    curl \
    unzip \
    git \
    bash \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && ./aws/install  && rm awscliv2.zip \
    && curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 \
    && chmod 700 get_helm.sh  \
    && ./get_helm.sh \
    && helm plugin install https://github.com/helm-unittest/helm-unittest.git --version 0.3.6 \
    && helm plugin install https://github.com/losisin/helm-values-schema-json.git --version 1.1.0 \
    && helm plugin install https://github.com/hypnoglow/helm-s3.git --version 0.13.0 \
    && rm ./get_helm.sh \
    && git clone https://github.com/bitnami/readme-generator-for-helm \
    && cd ./readme-generator-for-helm && npm install && npm install -g

WORKDIR ${APP_DIR}

COPY src/ /app/src/
COPY package.json /app/package.json
COPY tsconfig.json /app/tsconfig.json

RUN npm install && npm install -g && npm run global-local-install

WORKDIR ${HELM_CHART_DIR}

RUN chmod 777 /app/chart

ENTRYPOINT ["helm-packager"]