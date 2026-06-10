const VALID_STATUSES = ['active', 'inactive', 'completed'];

const validateName = (name, isRequired = true) => {
  if (isRequired && (name === undefined || name === null)) {
    return 'name is required';
  }
  if (name !== undefined && name !== null) {
    if (typeof name !== 'string' || name.trim().length < 3) {
      return 'name must be at least 3 characters';
    }
    if (name.trim().length > 100) {
      return 'name must be at most 100 characters';
    }
  }
  return null;
};

const validateDescription = (description, isRequired = true) => {
  if (isRequired && (description === undefined || description === null)) {
    return 'description is required';
  }
  if (description !== undefined && description !== null) {
    if (typeof description !== 'string' || description.trim().length < 10) {
      return 'description must be at least 10 characters';
    }
    if (description.trim().length > 500) {
      return 'description must be at most 500 characters';
    }
  }
  return null;
};

const validateOwnerId = (ownerId, isRequired = true) => {
  if (isRequired && (ownerId === undefined || ownerId === null)) {
    return 'ownerId is required';
  }
  if (ownerId !== undefined && ownerId !== null) {
    if (typeof ownerId !== 'string' || ownerId.trim().length === 0) {
      return 'ownerId must be a non-empty string';
    }
  }
  return null;
};

const validateStatus = (status, isRequired = true) => {
  if (isRequired && (status === undefined || status === null)) {
    return 'status is required';
  }
  if (status !== undefined && status !== null) {
    if (!VALID_STATUSES.includes(status)) {
      return 'status must be one of: active, inactive, completed';
    }
  }
  return null;
};

const validateCreateProject = (req, res, next) => {
  const { name, description, ownerId, status } = req.body;
  const errors = [];

  const nameError = validateName(name, true);
  if (nameError) errors.push(nameError);

  const descriptionError = validateDescription(description, true);
  if (descriptionError) errors.push(descriptionError);

  const ownerIdError = validateOwnerId(ownerId, true);
  if (ownerIdError) errors.push(ownerIdError);

  const statusError = validateStatus(status, true);
  if (statusError) errors.push(statusError);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateUpdateProject = (req, res, next) => {
  const { name, description, ownerId, status } = req.body;
  const errors = [];

  const nameError = validateName(name, false);
  if (nameError) errors.push(nameError);

  const descriptionError = validateDescription(description, false);
  if (descriptionError) errors.push(descriptionError);

  const ownerIdError = validateOwnerId(ownerId, false);
  if (ownerIdError) errors.push(ownerIdError);

  const statusError = validateStatus(status, false);
  if (statusError) errors.push(statusError);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = { validateCreateProject, validateUpdateProject };
