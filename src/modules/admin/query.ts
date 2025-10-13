export default {
  createAdmin: `
    INSERT INTO 
      admins(email, password, role, verified, created_at, updated_at)
    VALUES 
      ($(email), $(password), 'admin', $(verified), NOW(), NOW())
    RETURNING id, user_id, email, verified, role, created_at, updated_at
  `,

  getAdmin: `
    SELECT
      id,
      user_id,
      email,
      password,
      verified,
      role,
      created_at,
      updated_at
    FROM admins
    WHERE (user_id = $1 OR email = $1) AND role = 'admin'
  `,

  getAdmins: `
    SELECT
      id,
      user_id,
      email,
      verified,
      role,
      created_at,
      updated_at
    FROM admins
    WHERE role = 'admin'
    AND ($1::text IS NULL OR email ILIKE '%' || $1 || '%')
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `,

  getAdminsCount: `
    SELECT COUNT(*) as total
    FROM admins
    WHERE role = 'admin'
    AND ($1::text IS NULL OR email ILIKE '%' || $1 || '%')
  `,

  updateAdmin: `
    UPDATE admins
    SET
      email = COALESCE($2, email),
      password = COALESCE($3, password),
      verified = COALESCE($4, verified),
      updated_at = NOW()
    WHERE user_id = $1 AND role = 'admin'
  `,

  deleteAdmin: `
    DELETE FROM admins
    WHERE user_id = $1 AND role = 'admin'
  `,

  verifyAdmin: `
    UPDATE admins
    SET
      verified = true,
      updated_at = NOW()
    WHERE user_id = $1 AND role = 'admin'
  `,
};
