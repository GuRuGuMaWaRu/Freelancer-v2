function parseClientName(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const name = value.trim();

  if (!name) {
    return null;
  }

  return name;
}

export default parseClientName;
