export default {
  createDiary: `
    INSERT INTO 
      diaries(name, content, user_id, description, image_url, updated_at, created_at)
    VALUES 
      ($(name), $(content), $(user_id), $(description), $(image_url), NOW(), NOW())
    RETURNING id, diary_id
  `,

  getDiary: `
    SELECT
      id,
      diary_id,
      name,
      content,
      user_id,
      description,
      image_url,
      created_at,
      updated_at
    FROM diaries
    WHERE diary_id = $1
    AND ($2::text IS NULL OR name ILIKE '%' || $2 || '%' OR content ILIKE '%' || $2 || '%' OR description ILIKE '%' || $2 || '%')
  `,

  getDiariesByUser: `
    SELECT
      id,
      diary_id,
      name,
      content,
      user_id,
      description,
      image_url,
      created_at,
      updated_at
    FROM diaries
    WHERE user_id = $1
    AND ($2::text IS NULL OR name ILIKE '%' || $2 || '%' OR content ILIKE '%' || $2 || '%' OR description ILIKE '%' || $2 || '%')
    ORDER BY created_at DESC
    LIMIT $3 OFFSET $4
  `,

  getDiariesByUserCount: `
    SELECT COUNT(*) as total
    FROM diaries
    WHERE user_id = $1
    AND ($2::text IS NULL OR name ILIKE '%' || $2 || '%' OR content ILIKE '%' || $2 || '%' OR description ILIKE '%' || $2 || '%')
  `,

  updateDiary: `
    UPDATE diaries
    SET
      name = $1,
      content = $2,
      image_url = $3,
      description = $4,
      updated_at = NOW()
    WHERE diary_id = $5
  `,

  deleteDiary: `
    DELETE FROM diaries
    WHERE diary_id = $1
  `,
};
