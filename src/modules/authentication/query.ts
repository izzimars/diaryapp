export default {
  createUser: `
    INSERT INTO 
      users(email)
    VALUES 
      ($(email))
    RETURNING id, user_id, email, verified, role, otp, otp_expiry, created_at, updated_at
  `,

  getUser: `
    SELECT
      id,
      user_id,
      email,
      otp,
      otp_expiry,
      role,
      verified,
      created_at,
      updated_at
    FROM users
    WHERE
      user_id = $1 OR email = $1
  `,

  verifyUser: `
    UPDATE users
    SET
      verified = true,
      updated_at = NOW()
    WHERE email = $1
  `,

  getUsers: `
    SELECT
      id,
      user_id,
      email,
      verified,
      role,
      created_at,
      updated_at
    FROM users
    WHERE ($1::text IS NULL OR email ILIKE '%' || $1 || '%')
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `,

  getUsersCount: `
    SELECT COUNT(*) as total
    FROM users
    WHERE ($1::text IS NULL OR email ILIKE '%' || $1 || '%')
  `,

  updateOtp: `
    UPDATE users
    SET
      otp = $1,
      otp_expiry = $2,
      updated_at = NOW()
    WHERE email = $3
  `,
};
