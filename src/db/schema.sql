--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13 (Homebrew)
-- Dumped by pg_dump version 14.13 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: inbox_item_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.inbox_item_type AS ENUM (
    'push',
    'system_alert',
    'system_message',
    'appointment',
    'reminder'
);


--
-- Name: notification_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.notification_status AS ENUM (
    'unread',
    'read',
    'archived',
    'deleted'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: blogs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blogs (
    id text NOT NULL,
    title text NOT NULL,
    author text NOT NULL,
    tags text,
    video text,
    thumbnail text,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    slug text,
    duration_hours integer DEFAULT 0,
    duration_minutes integer DEFAULT 0,
    audio text
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id character varying(20) NOT NULL,
    label text NOT NULL,
    type text NOT NULL,
    icon text,
    created_at timestamp without time zone DEFAULT now(),
    image_mobile text,
    image_desktop text
);


--
-- Name: companies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.companies (
    id text NOT NULL,
    name text NOT NULL,
    logo_url text,
    max_users integer DEFAULT 10,
    max_booking_credits_per_user integer DEFAULT 5,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    code text,
    practitioners text[] DEFAULT '{}'::text[],
    CONSTRAINT companies_max_booking_credits_per_user_check CHECK ((max_booking_credits_per_user >= 0)),
    CONSTRAINT companies_max_users_check CHECK ((max_users > 0))
);


--
-- Name: daily_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.daily_activities (
    id text NOT NULL,
    user_id text,
    reading_minutes integer DEFAULT 0,
    video_minutes integer DEFAULT 0,
    writing_minutes integer DEFAULT 0,
    task_minutes integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: daily_check_ins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.daily_check_ins (
    id text NOT NULL,
    user_id text,
    responses jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: featured_content; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.featured_content (
    id text NOT NULL,
    ids text[] NOT NULL,
    type text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: inbox_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inbox_items (
    id text NOT NULL,
    user_id text NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    url text,
    item_type public.inbox_item_type DEFAULT 'push'::public.inbox_item_type NOT NULL,
    status public.notification_status DEFAULT 'unread'::public.notification_status NOT NULL,
    delivered_at timestamp with time zone,
    read_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: likes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.likes (
    id text NOT NULL,
    user_id text NOT NULL,
    post_id text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: marli; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marli (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "time" text NOT NULL,
    location text NOT NULL,
    image text NOT NULL,
    link text NOT NULL,
    date date NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: partners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partners (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "time" text NOT NULL,
    location text NOT NULL,
    image text NOT NULL,
    link text NOT NULL,
    date date NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_reset_tokens (
    id text NOT NULL,
    user_id text NOT NULL,
    token text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    used boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.posts (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    category text NOT NULL,
    author text NOT NULL,
    tags text,
    video text,
    audio text,
    thumbnail text,
    description text,
    duration_hours integer DEFAULT 0,
    duration_minutes integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: practitioners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.practitioners (
    id text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    profile_img text,
    description text,
    profession text,
    locations text[] DEFAULT '{}'::text[],
    clinic text,
    booking_link text,
    title text,
    expertise text[] DEFAULT '{}'::text[],
    languages text[] DEFAULT '{}'::text[],
    modalities text[] DEFAULT '{}'::text[],
    patient_focus text[] DEFAULT '{}'::text[],
    services text[] DEFAULT '{}'::text[],
    qualifications text[] DEFAULT '{}'::text[],
    accreditations text[] DEFAULT '{}'::text[],
    certifications text[] DEFAULT '{}'::text[],
    other_services text[] DEFAULT '{}'::text[],
    registrations jsonb DEFAULT '[]'::jsonb,
    identifications jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    halaxy_id text
);


--
-- Name: public_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.public_events (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "time" text NOT NULL,
    location text NOT NULL,
    image text NOT NULL,
    link text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL
);


--
-- Name: push_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.push_subscriptions (
    id text NOT NULL,
    user_id text NOT NULL,
    subscription jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name text NOT NULL
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    id text NOT NULL,
    image_url text,
    service_name text NOT NULL,
    description text,
    booking_link text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: short_courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.short_courses (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    image text NOT NULL,
    link text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tags (
    id text NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: user_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_activities (
    id text NOT NULL,
    user_id text NOT NULL,
    target_id text NOT NULL,
    target_type text NOT NULL,
    action text NOT NULL,
    activity_date date DEFAULT CURRENT_DATE NOT NULL,
    duration integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    user_id text NOT NULL,
    role_id integer NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id text NOT NULL,
    first_name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone,
    last_name text,
    profile_img text,
    company text,
    patient_id text,
    phone text
);


--
-- Name: webinars; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.webinars (
    id text NOT NULL,
    title text NOT NULL,
    author text NOT NULL,
    tags text,
    video text,
    thumbnail text,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    slug text,
    duration_hours integer DEFAULT 0,
    duration_minutes integer DEFAULT 0,
    audio text
);


--
-- Name: who5_responses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.who5_responses (
    id text NOT NULL,
    user_id text NOT NULL,
    q1 integer NOT NULL,
    q2 integer NOT NULL,
    q3 integer NOT NULL,
    q4 integer NOT NULL,
    q5 integer NOT NULL,
    raw_score integer GENERATED ALWAYS AS (((((q1 + q2) + q3) + q4) + q5)) STORED,
    percentage_score integer GENERATED ALWAYS AS ((((((q1 + q2) + q3) + q4) + q5) * 4)) STORED,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT who5_responses_q1_check CHECK (((q1 >= 0) AND (q1 <= 5))),
    CONSTRAINT who5_responses_q2_check CHECK (((q2 >= 0) AND (q2 <= 5))),
    CONSTRAINT who5_responses_q3_check CHECK (((q3 >= 0) AND (q3 <= 5))),
    CONSTRAINT who5_responses_q4_check CHECK (((q4 >= 0) AND (q4 <= 5))),
    CONSTRAINT who5_responses_q5_check CHECK (((q5 >= 0) AND (q5 <= 5)))
);


--
-- Name: yogas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.yogas (
    id text NOT NULL,
    title text NOT NULL,
    author text NOT NULL,
    tags text,
    video text,
    thumbnail text,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    slug text,
    duration_hours integer DEFAULT 0,
    duration_minutes integer DEFAULT 0,
    audio text
);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: blogs blogs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_pkey PRIMARY KEY (id);


--
-- Name: blogs blogs_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_slug_key UNIQUE (slug);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: companies companies_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_name_key UNIQUE (name);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: daily_activities daily_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_activities
    ADD CONSTRAINT daily_activities_pkey PRIMARY KEY (id);


--
-- Name: daily_check_ins daily_check_ins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_check_ins
    ADD CONSTRAINT daily_check_ins_pkey PRIMARY KEY (id);


--
-- Name: featured_content featured_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.featured_content
    ADD CONSTRAINT featured_content_pkey PRIMARY KEY (id);


--
-- Name: inbox_items inbox_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inbox_items
    ADD CONSTRAINT inbox_items_pkey PRIMARY KEY (id);


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- Name: likes likes_user_id_post_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_user_id_post_id_key UNIQUE (user_id, post_id);


--
-- Name: marli marli_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marli
    ADD CONSTRAINT marli_pkey PRIMARY KEY (id);


--
-- Name: partners partners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_token_key UNIQUE (token);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: posts posts_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key UNIQUE (slug);


--
-- Name: practitioners practitioners_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.practitioners
    ADD CONSTRAINT practitioners_email_key UNIQUE (email);


--
-- Name: practitioners practitioners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.practitioners
    ADD CONSTRAINT practitioners_pkey PRIMARY KEY (id);


--
-- Name: public_events public_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.public_events
    ADD CONSTRAINT public_events_pkey PRIMARY KEY (id);


--
-- Name: push_subscriptions push_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: short_courses short_courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.short_courses
    ADD CONSTRAINT short_courses_pkey PRIMARY KEY (id);


--
-- Name: tags tags_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: user_activities user_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activities
    ADD CONSTRAINT user_activities_pkey PRIMARY KEY (id);


--
-- Name: user_activities user_activities_user_id_target_id_action_activity_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activities
    ADD CONSTRAINT user_activities_user_id_target_id_action_activity_date_key UNIQUE (user_id, target_id, action, activity_date);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: webinars webinars_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webinars
    ADD CONSTRAINT webinars_pkey PRIMARY KEY (id);


--
-- Name: webinars webinars_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webinars
    ADD CONSTRAINT webinars_slug_key UNIQUE (slug);


--
-- Name: who5_responses who5_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.who5_responses
    ADD CONSTRAINT who5_responses_pkey PRIMARY KEY (id);


--
-- Name: yogas yogas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.yogas
    ADD CONSTRAINT yogas_pkey PRIMARY KEY (id);


--
-- Name: yogas yogas_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.yogas
    ADD CONSTRAINT yogas_slug_key UNIQUE (slug);


--
-- Name: gin_practitioners_accreditations; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX gin_practitioners_accreditations ON public.practitioners USING gin (accreditations);


--
-- Name: gin_practitioners_certifications; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX gin_practitioners_certifications ON public.practitioners USING gin (certifications);


--
-- Name: gin_practitioners_expertise; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX gin_practitioners_expertise ON public.practitioners USING gin (expertise);


--
-- Name: gin_practitioners_identifications; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX gin_practitioners_identifications ON public.practitioners USING gin (identifications);


--
-- Name: gin_practitioners_languages; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX gin_practitioners_languages ON public.practitioners USING gin (languages);


--
-- Name: gin_practitioners_modalities; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX gin_practitioners_modalities ON public.practitioners USING gin (modalities);


--
-- Name: gin_practitioners_other_services; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX gin_practitioners_other_services ON public.practitioners USING gin (other_services);


--
-- Name: gin_practitioners_patient_focus; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX gin_practitioners_patient_focus ON public.practitioners USING gin (patient_focus);


--
-- Name: gin_practitioners_qualifications; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX gin_practitioners_qualifications ON public.practitioners USING gin (qualifications);


--
-- Name: gin_practitioners_registrations; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX gin_practitioners_registrations ON public.practitioners USING gin (registrations);


--
-- Name: gin_practitioners_services; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX gin_practitioners_services ON public.practitioners USING gin (services);


--
-- Name: idx_practitioners_clinic; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_practitioners_clinic ON public.practitioners USING btree (clinic);


--
-- Name: idx_practitioners_first_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_practitioners_first_name ON public.practitioners USING btree (first_name);


--
-- Name: idx_practitioners_last_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_practitioners_last_name ON public.practitioners USING btree (last_name);


--
-- Name: idx_practitioners_location; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_practitioners_location ON public.practitioners USING btree (locations);


--
-- Name: daily_activities daily_activities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_activities
    ADD CONSTRAINT daily_activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: daily_check_ins daily_check_ins_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_check_ins
    ADD CONSTRAINT daily_check_ins_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: password_reset_tokens fk_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: likes likes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: likes likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

