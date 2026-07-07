function parseClientName(value) {
  if (typeof value !== "string") {
    return null;
  }

  const name = value.trim();

  if (!name) {
    return null;
  }

  return name;
}

module.exports = parseClientName;
