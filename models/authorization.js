function can(user, feature, resource) {
  let authorized = false;

  if (user.features.includes(feature)) {
    authorized = true;
  }

  if (feature === "update:user" && resource) {
    authorized = false;
    if (user.id === resource.id || can(user, "update:user:others")) {
      authorized = true;
    }
  }

  return authorized;
}

function filterOutput(user, feature, resource) {
  let secureOutputValues;
  if (feature === "read:user") {
    secureOutputValues = {
      id: resource.id,
      username: resource.username,
      features: resource.features,
      created_at: resource.created_at,
      updated_at: resource.updated_at,
    };
  }

  if (feature === "read:user:self") {
    if (user.id === resource.id) {
      return {
        id: resource.id,
        username: resource.username,
        email: resource.email,
        features: resource.features,
        created_at: resource.created_at,
        updated_at: resource.updated_at,
      };
    }
  }

  if (feature === "read:activation_token") {
    secureOutputValues = {
      id: resource.id,
      user_id: resource.user_id,
      created_at: resource.created_at,
      updated_at: resource.updated_at,
      expires_at: resource.expires_at,
      used_at: resource.used_at,
    };
  }

  if (feature === "read:session") {
    secureOutputValues = {
      id: resource.id,
      token: resource.token,
      user_id: resource.user_id,
      expires_at: resource.expires_at,
      created_at: resource.created_at,
      updated_at: resource.updated_at,
    };
  }

  if (feature === "read:status") {
    secureOutputValues = {
      updated_at: resource.updated_at,
      dependencies: {
        database: {
          max_connections: resource.database.max_connections,
          opened_connections: resource.database.opened_connections,
        },
      },
    };
    if (can(user, "read:status:all")) {
      secureOutputValues.dependencies.database.version =
        resource.database.version;
    }
  }

  if (feature === "read:migrations") {
    secureOutputValues = resource.map((migration) => {
      return {
        path: migration.path,
        name: migration.name,
        timestamp: migration.timestamp,
      };
    });
  }
  return secureOutputValues ?? {};
}

const authorization = {
  can,
  filterOutput,
};

export default authorization;
