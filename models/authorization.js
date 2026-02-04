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

function filterOutput(user, feature, output) {
  const defaultSecureOutput = {
    id: output.id,
    username: output.username,
    features: output.features,
    created_at: output.created_at,
    updated_at: output.updated_at,
  };
  let secureOutputValues;
  if (feature === "read:user") {
    secureOutputValues = defaultSecureOutput;
  }
  if (feature === "read:user:updated" && can(user, feature)) {
    secureOutputValues = { ...defaultSecureOutput, email: output.email };
    if (user.id !== output.id && can(user, "update:user:others")) {
      secureOutputValues = {
        ...secureOutputValues,
        updated_by: user.username,
      };
    }
  }
  return secureOutputValues ?? {};
}

const authorization = {
  can,
  filterOutput,
};

export default authorization;
