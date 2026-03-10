import pool from "./db";

async function migrate() {

  // const resetDatabase = `
  //   DROP SCHEMA public CASCADE;
  //   CREATE SCHEMA public;
  //   GRANT ALL ON SCHEMA public TO ansaadmin;
  //   GRANT ALL ON SCHEMA public TO public;
  // `;

  const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    profile_img TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
  );
`;

const createPasswordResetTokensTable = `
  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT fk_user
      FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
  );
`;


  const createDailyActivitiesTable = `
  CREATE TABLE daily_activities (
  id TEXT PRIMARY KEY, -- nanoid
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  reading_minutes INTEGER DEFAULT 0,
  video_minutes INTEGER DEFAULT 0,
  writing_minutes INTEGER DEFAULT 0,
  task_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);`

  const createDailyCheckInsTable = `
  CREATE TABLE IF NOT EXISTS daily_check_ins (
    id TEXT PRIMARY KEY, -- nanoid
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    responses JSONB NOT NULL, -- stores [{question: "...", answer: 1}, ...]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
  );
`;


  const createPostsTable = `
  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY, -- nanoid
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,  
    category TEXT NOT NULL,  
    author TEXT NOT NULL,
    tags TEXT, -- could also be TEXT[] if you want multiple tags
    video TEXT, -- optional (e.g. video URL),
    audio TEXT, -- optional (e.g. video URL),
    thumbnail TEXT, -- optional (image URL)
    description TEXT,
    duration_hours INTEGER DEFAULT 0,
    duration_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
  );
`;

  const createTagsTable = `
CREATE TABLE tags (
  id TEXT PRIMARY KEY,      -- nanoid
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);`;



const createRolesTable = `
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);
`;

const createUserRolesTable = `
CREATE TABLE IF NOT EXISTS user_roles (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);
`

const insertDefaultRole = `
  INSERT INTO roles (name)
  VALUES ('user')
  ON CONFLICT (name) DO NOTHING;

  -- 4. Assign default role to all existing users
  INSERT INTO user_roles (user_id, role_id)
  SELECT u.id, r.id
  FROM users u
  CROSS JOIN (SELECT id FROM roles WHERE name = 'user') r
  ON CONFLICT DO NOTHING;
  `

const createPractitionersTable = `
-- Create the practitioners table
CREATE TABLE practitioners (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    profile_img TEXT,
    description TEXT,
    profession TEXT,
    location TEXT,
    clinic TEXT,
    booking_link TEXT,
    title TEXT,

    expertise TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{}',
    modalities TEXT[] DEFAULT '{}',
    patient_focus TEXT[] DEFAULT '{}',
    services TEXT[] DEFAULT '{}',
    qualifications TEXT[] DEFAULT '{}',
    accreditations TEXT[] DEFAULT '{}',
    certifications TEXT[] DEFAULT '{}',
    other_services TEXT[] DEFAULT '{}',

    registrations JSONB DEFAULT '[]'::jsonb,
    identifications JSONB DEFAULT '[]'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Standard B-tree indexes
CREATE INDEX idx_practitioners_first_name ON practitioners(first_name);
CREATE INDEX idx_practitioners_last_name ON practitioners(last_name);
CREATE INDEX idx_practitioners_location ON practitioners(location);
CREATE INDEX idx_practitioners_clinic ON practitioners(clinic);

-- GIN indexes for array columns
CREATE INDEX gin_practitioners_expertise ON practitioners USING GIN(expertise);
CREATE INDEX gin_practitioners_languages ON practitioners USING GIN(languages);
CREATE INDEX gin_practitioners_modalities ON practitioners USING GIN(modalities);
CREATE INDEX gin_practitioners_patient_focus ON practitioners USING GIN(patient_focus);
CREATE INDEX gin_practitioners_services ON practitioners USING GIN(services);
CREATE INDEX gin_practitioners_qualifications ON practitioners USING GIN(qualifications);
CREATE INDEX gin_practitioners_accreditations ON practitioners USING GIN(accreditations);
CREATE INDEX gin_practitioners_certifications ON practitioners USING GIN(certifications);
CREATE INDEX gin_practitioners_other_services ON practitioners USING GIN(other_services);

-- Optional: JSONB indexing for faster JSON queries
CREATE INDEX gin_practitioners_registrations ON practitioners USING GIN(registrations);
CREATE INDEX gin_practitioners_identifications ON practitioners USING GIN(identifications);

`;


const createUserActivitiesTable = `
CREATE TABLE user_activities (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  target_type TEXT NOT NULL,    -- e.g. 'BLOG' | 'VIDEO'
  action TEXT NOT NULL,         -- e.g. 'READ' | 'WATCH'
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, target_id, action, activity_date)
);
`
const createEventsTable = `
CREATE TABLE public_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  image TEXT NOT NULL,
  link TEXT NOT NULL,
  date DATE NOT NULL;
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
`
const createMarliTable = `
CREATE TABLE marli (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  image TEXT NOT NULL,
  link TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
);
`
const createPartnersTable = `
CREATE TABLE partners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  image TEXT NOT NULL,
  link TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
);
`
const createShortCoursesTable = `
CREATE TABLE short_courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  link TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
`

const createCompaniesTable = `CREATE TABLE companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT,
  logo_url TEXT, -- optional logo
  max_users INT DEFAULT 10 CHECK (max_users > 0),
  max_booking_credits_per_user INT DEFAULT 5 CHECK (max_booking_credits_per_user >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
`

const createFeaturedContentTable = `CREATE TABLE featured_content (
  id TEXT PRIMARY KEY,
  ids TEXT[] NOT NULL,       -- array of post IDs
  type TEXT NOT NULL,        -- e.g., "banner", "highlight", "carousel"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
`
const createWho5ResponsesTable = `
CREATE TABLE who5_responses (
  id TEXT PRIMARY KEY,                     -- e.g. nanoid()
  user_id TEXT NOT NULL,                   -- reference to users table
  q1 INT NOT NULL CHECK (q1 BETWEEN 0 AND 5),  -- Cheerful and in good spirits
  q2 INT NOT NULL CHECK (q2 BETWEEN 0 AND 5),  -- Calm and relaxed
  q3 INT NOT NULL CHECK (q3 BETWEEN 0 AND 5),  -- Active and vigorous
  q4 INT NOT NULL CHECK (q4 BETWEEN 0 AND 5),  -- Fresh and rested
  q5 INT NOT NULL CHECK (q5 BETWEEN 0 AND 5),  -- Interested in daily life
  raw_score INT GENERATED ALWAYS AS (q1 + q2 + q3 + q4 + q5) STORED,
  percentage_score INT GENERATED ALWAYS AS ((q1 + q2 + q3 + q4 + q5) * 4) STORED,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
`;

const createLikesTable = `
CREATE TABLE likes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE (user_id, post_id)
);`

const createCategoriesTable = `
CREATE TABLE categories (
  id VARCHAR(20) PRIMARY KEY,
  label TEXT NOT NULL,
  type TEXT NOT NULL,
  icon TEXT,
  image_desktop TEXT,
  image_mobile TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);`


const createInboxItemsTable = `
-- Create enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_status') THEN
    CREATE TYPE notification_status AS ENUM ('unread', 'read', 'archived', 'deleted');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inbox_item_type') THEN
    CREATE TYPE inbox_item_type AS ENUM ('push', 'system_alert', 'system_message', 'appointment', 'reminder');
  END IF;
END$$;

-- Create table
CREATE TABLE IF NOT EXISTS inbox_items (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,

  -- message content
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  url TEXT DEFAULT NULL,

  -- tags
  item_type inbox_item_type NOT NULL DEFAULT 'push',
  status notification_status NOT NULL DEFAULT 'unread',

  -- tracking timestamps
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,

  -- system fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
`;


const createPushSubscriptionsTable = `
DROP TABLE IF EXISTS push_subscriptions;
CREATE TABLE push_subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,      
  subscription JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
)

`;


  try {
    console.log("🚀 Starting migration...");
    // Uncomment this line and resetDatabase function above if you want to reset the database
    // await pool.query(resetDatabase);

    console.log("✅ Database schema reset (if uncommented).");

    console.log("✅ Dropping existing triggers if they exist...");

    console.log("✅ Creating tables...");
    await pool.query(createUsersTable);
    await pool.query(createDailyActivitiesTable);
    await pool.query(createDailyCheckInsTable);
    await pool.query(createPostsTable);
    await pool.query(createTagsTable);
    await pool.query(createRolesTable);
    await pool.query(createUserRolesTable);
    await pool.query(insertDefaultRole);
    await pool.query(createPractitionersTable);
    await pool.query(createUserActivitiesTable); 
    await pool.query(createEventsTable); 
    await pool.query(createCompaniesTable);
    await pool.query(createFeaturedContentTable);
    await pool.query(createWho5ResponsesTable);
    await pool.query(createCategoriesTable);
    await pool.query(createLikesTable);
    await pool.query(createInboxItemsTable);
    await pool.query(createPushSubscriptionsTable);
    await pool.query(createPasswordResetTokensTable);
    await pool.query(createMarliTable);
    await pool.query(createPartnersTable);
    await pool.query(createShortCoursesTable);
    
    console.log("✅ Tables created successfully.");


    console.log("🎉 Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    pool.end();
  }
}

migrate()