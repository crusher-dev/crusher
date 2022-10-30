--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5

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
-- Name: cli_status_status; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.cli_status_status AS ENUM (
    'Started',
    'Completed'
);


ALTER TYPE public.cli_status_status OWNER TO utkarsh;

--
-- Name: integrations_integration_name; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.integrations_integration_name AS ENUM (
    'SLACK',
    'VERCEL'
);


ALTER TYPE public.integrations_integration_name OWNER TO utkarsh;

--
-- Name: job_reports_status; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.job_reports_status AS ENUM (
    'PASSED',
    'FAILED',
    'MANUAL_REVIEW_REQUIRED',
    'RUNNING'
);


ALTER TYPE public.job_reports_status OWNER TO utkarsh;

--
-- Name: jobs_build_trigger; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.jobs_build_trigger AS ENUM (
    'MANUAL',
    'CLI',
    'CRON'
);


ALTER TYPE public.jobs_build_trigger OWNER TO utkarsh;

--
-- Name: jobs_status; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.jobs_status AS ENUM (
    'CREATED',
    'QUEUED',
    'RUNNING',
    'FINISHED',
    'TIMEOUT',
    'ABORTED'
);


ALTER TYPE public.jobs_status OWNER TO utkarsh;

--
-- Name: teams_tier; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.teams_tier AS ENUM (
    'FREE',
    'STARTER',
    'PRO'
);


ALTER TYPE public.teams_tier OWNER TO utkarsh;

--
-- Name: test_instance_result_sets_conclusion; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.test_instance_result_sets_conclusion AS ENUM (
    'PASSED',
    'FAILED',
    'MANUAL_REVIEW_REQUIRED'
);


ALTER TYPE public.test_instance_result_sets_conclusion OWNER TO utkarsh;

--
-- Name: test_instance_result_sets_status; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.test_instance_result_sets_status AS ENUM (
    'WAITING_FOR_TEST_EXECUTION',
    'RUNNING_CHECKS',
    'FINISHED_RUNNING_CHECKS'
);


ALTER TYPE public.test_instance_result_sets_status OWNER TO utkarsh;

--
-- Name: test_instance_results_status; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.test_instance_results_status AS ENUM (
    'PASSED',
    'FAILED',
    'MANUAL_REVIEW_REQUIRED'
);


ALTER TYPE public.test_instance_results_status OWNER TO utkarsh;

--
-- Name: test_instances_browser; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.test_instances_browser AS ENUM (
    'CHROME',
    'FIREFOX',
    'SAFARI'
);


ALTER TYPE public.test_instances_browser OWNER TO utkarsh;

--
-- Name: test_instances_status; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.test_instances_status AS ENUM (
    'QUEUED',
    'RUNNING',
    'FINISHED',
    'TIMEOUT',
    'ABORTED'
);


ALTER TYPE public.test_instances_status OWNER TO utkarsh;

--
-- Name: user_project_roles_role; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.user_project_roles_role AS ENUM (
    'ADMIN',
    'REVIEWER',
    'EDITOR',
    'VIEWER'
);


ALTER TYPE public.user_project_roles_role OWNER TO utkarsh;

--
-- Name: user_provider_connections_provider; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.user_provider_connections_provider AS ENUM (
    'GITHUB',
    'GITLAB'
);


ALTER TYPE public.user_provider_connections_provider OWNER TO utkarsh;

--
-- Name: user_team_roles_role; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.user_team_roles_role AS ENUM (
    'MEMBER',
    'ADMIN'
);


ALTER TYPE public.user_team_roles_role OWNER TO utkarsh;

--
-- Name: on_update_current_timestamp_environments(); Type: FUNCTION; Schema: public; Owner: utkarsh
--

CREATE FUNCTION public.on_update_current_timestamp_environments() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.on_update_current_timestamp_environments() OWNER TO utkarsh;

--
-- Name: updated_timestamp_func(); Type: FUNCTION; Schema: public; Owner: utkarsh
--

CREATE FUNCTION public.updated_timestamp_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.updated_timestamp_func() OWNER TO utkarsh;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alerting; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.alerting (
    user_id bigint NOT NULL,
    github_code character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.alerting OWNER TO utkarsh;

--
-- Name: cli_status; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.cli_status (
    status public.cli_status_status DEFAULT 'Started'::public.cli_status_status,
    user_id integer,
    team_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    token character varying(255)
);


ALTER TABLE public.cli_status OWNER TO utkarsh;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    user_id bigint NOT NULL,
    result_id integer NOT NULL,
    report_id integer NOT NULL,
    message text NOT NULL,
    replied_to integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.comments OWNER TO utkarsh;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.comments ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: custom_codes; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.custom_codes (
    id integer NOT NULL,
    team_id integer,
    code text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    name text
);


ALTER TABLE public.custom_codes OWNER TO avnadmin;

--
-- Name: custom_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.custom_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.custom_codes_id_seq OWNER TO avnadmin;

--
-- Name: custom_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.custom_codes_id_seq OWNED BY public.custom_codes.id;


--
-- Name: environments; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.environments (
    id integer NOT NULL,
    project_id integer NOT NULL,
    name character varying(100) NOT NULL,
    browser json NOT NULL,
    vars text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone,
    user_id bigint NOT NULL,
    host character varying(255)
);


ALTER TABLE public.environments OWNER TO utkarsh;

--
-- Name: environments_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.environments ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.environments_id_seq
    START WITH 67
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: git_integrations; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.git_integrations (
    id integer NOT NULL,
    project_id integer NOT NULL,
    user_id integer,
    repo_name character varying(200),
    repo_link character varying(200),
    installation_id character varying(200),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    repo_id character varying(200)
);


ALTER TABLE public.git_integrations OWNER TO utkarsh;

--
-- Name: git_integrations_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.git_integrations ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.git_integrations_id_seq
    START WITH 11
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: github_app_installations; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.github_app_installations (
    owner_name character varying(255) NOT NULL,
    repo_name character varying(255) NOT NULL,
    installation_id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.github_app_installations OWNER TO utkarsh;

--
-- Name: integration_alerting; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.integration_alerting (
    id integer NOT NULL,
    project_id integer NOT NULL,
    integration_id integer,
    user_id integer NOT NULL,
    config text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.integration_alerting OWNER TO utkarsh;

--
-- Name: integration_alerting_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.integration_alerting ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.integration_alerting_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: integrations; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.integrations (
    id integer NOT NULL,
    project_id integer NOT NULL,
    integration_name public.integrations_integration_name NOT NULL,
    meta json NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.integrations OWNER TO utkarsh;

--
-- Name: TABLE integrations; Type: COMMENT; Schema: public; Owner: utkarsh
--

COMMENT ON TABLE public.integrations IS 'This table and user_provider_connections should merge';


--
-- Name: integrations_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.integrations ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.integrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: job_reports; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.job_reports (
    id integer NOT NULL,
    job_id integer NOT NULL,
    reference_job_id integer,
    total_test_count integer,
    passed_test_count integer,
    failed_test_count integer,
    review_required_test_count integer,
    project_id integer NOT NULL,
    status public.job_reports_status DEFAULT 'RUNNING'::public.job_reports_status NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    status_explanation text,
    meta json
);


ALTER TABLE public.job_reports OWNER TO utkarsh;

--
-- Name: job_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.job_reports ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.job_reports_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.jobs (
    id integer NOT NULL,
    latest_report_id integer,
    pr_id character varying(255),
    commit_id character varying(50),
    repo_name character varying(255),
    branch_name character varying(200),
    commit_name text,
    status public.jobs_status DEFAULT 'CREATED'::public.jobs_status NOT NULL,
    host character varying(255) NOT NULL,
    build_trigger public.jobs_build_trigger DEFAULT 'MANUAL'::public.jobs_build_trigger NOT NULL,
    meta text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    check_run_id character varying(100),
    browser json NOT NULL,
    installation_id character varying(255),
    user_id bigint,
    project_id integer,
    config json NOT NULL,
    is_draft_job boolean DEFAULT false NOT NULL
);


ALTER TABLE public.jobs OWNER TO utkarsh;

--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.jobs ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.jobs_id_seq
    START WITH 14002
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: monitorings; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.monitorings (
    id integer NOT NULL,
    project_id integer NOT NULL,
    environment_id integer NOT NULL,
    last_cron_run timestamp with time zone DEFAULT '1970-01-02 07:29:40+00'::timestamp with time zone,
    test_interval integer DEFAULT 86400,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.monitorings OWNER TO utkarsh;

--
-- Name: monitorings_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.monitorings ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.monitorings_id_seq
    START WITH 96
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: project_hosts; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.project_hosts (
    id integer NOT NULL,
    url text NOT NULL,
    host_name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    project_id integer NOT NULL,
    user_id bigint NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.project_hosts OWNER TO utkarsh;

--
-- Name: project_hosts_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.project_hosts ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.project_hosts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: projects; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    team_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    baseline_job_id integer,
    meta text,
    visual_baseline numeric DEFAULT 5 NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    emoji text
);


ALTER TABLE public.projects OWNER TO utkarsh;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.projects ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.projects_id_seq
    START WITH 850
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: teams; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.teams (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    team_email character varying(255),
    tier public.teams_tier DEFAULT 'FREE'::public.teams_tier NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    stripe_customer_id character varying(100),
    meta text,
    uuid character varying(50),
    deleted boolean DEFAULT false NOT NULL
);


ALTER TABLE public.teams OWNER TO utkarsh;

--
-- Name: teams_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.teams ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.teams_id_seq
    START WITH 796
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: templates; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.templates (
    id integer NOT NULL,
    events text,
    user_id bigint,
    project_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    name character varying(200) NOT NULL
);


ALTER TABLE public.templates OWNER TO utkarsh;

--
-- Name: templates_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.templates ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.templates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: test_instance_action_results; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.test_instance_action_results (
    instance_id integer NOT NULL,
    project_id integer NOT NULL,
    actions_result json NOT NULL,
    has_instance_passed boolean NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.test_instance_action_results OWNER TO utkarsh;

--
-- Name: test_instance_result_sets; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.test_instance_result_sets (
    id integer NOT NULL,
    report_id integer NOT NULL,
    instance_id integer NOT NULL,
    target_instance_id integer NOT NULL,
    status public.test_instance_result_sets_status DEFAULT 'WAITING_FOR_TEST_EXECUTION'::public.test_instance_result_sets_status NOT NULL,
    conclusion public.test_instance_result_sets_conclusion,
    failed_reason text,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.test_instance_result_sets OWNER TO utkarsh;

--
-- Name: test_instance_result_sets_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.test_instance_result_sets ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.test_instance_result_sets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: test_instance_results; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.test_instance_results (
    id integer NOT NULL,
    screenshot_id integer NOT NULL,
    target_screenshot_id integer NOT NULL,
    instance_result_set_id integer NOT NULL,
    diff_delta double precision DEFAULT '0'::double precision NOT NULL,
    diff_image_url text,
    status public.test_instance_results_status NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.test_instance_results OWNER TO utkarsh;

--
-- Name: test_instance_results_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.test_instance_results ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.test_instance_results_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: test_instance_screenshots; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.test_instance_screenshots (
    id integer NOT NULL,
    instance_id integer NOT NULL,
    name character varying(255) NOT NULL,
    url text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    action_index character varying(50) DEFAULT '0'::character varying NOT NULL
);


ALTER TABLE public.test_instance_screenshots OWNER TO utkarsh;

--
-- Name: test_instance_screenshots_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.test_instance_screenshots ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.test_instance_screenshots_id_seq
    START WITH 59820
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: test_instances; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.test_instances (
    id integer NOT NULL,
    job_id integer NOT NULL,
    test_id integer NOT NULL,
    status public.test_instances_status DEFAULT 'QUEUED'::public.test_instances_status NOT NULL,
    code text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    host character varying(255),
    browser public.test_instances_browser DEFAULT 'CHROME'::public.test_instances_browser NOT NULL,
    recorded_video_url text,
    recorded_clip_video_url text,
    meta text,
    context json DEFAULT '{}'::json,
    group_id character varying(200)
);


ALTER TABLE public.test_instances OWNER TO utkarsh;

--
-- Name: test_instances_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.test_instances ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.test_instances_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tests; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.tests (
    id integer NOT NULL,
    project_id integer NOT NULL,
    name character varying(200) NOT NULL,
    events text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id bigint NOT NULL,
    featured_video_url text,
    featured_screenshot_url text,
    deleted boolean DEFAULT false NOT NULL,
    meta text,
    draft_job_id integer,
    featured_clip_video_url text,
    tags character varying(20),
    run_after integer,
    test_folder integer,
    emoji text
);


ALTER TABLE public.tests OWNER TO utkarsh;

--
-- Name: tests_folder; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.tests_folder (
    id integer NOT NULL,
    name character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    update_at timestamp without time zone DEFAULT now() NOT NULL,
    project_id integer
);


ALTER TABLE public.tests_folder OWNER TO avnadmin;

--
-- Name: tests_folder_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.tests_folder_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tests_folder_id_seq OWNER TO avnadmin;

--
-- Name: tests_folder_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.tests_folder_id_seq OWNED BY public.tests_folder.id;


--
-- Name: tests_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.tests ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.tests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user_meta; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.user_meta (
    user_id bigint NOT NULL,
    key character varying(255) NOT NULL,
    value character varying(400) NOT NULL
);


ALTER TABLE public.user_meta OWNER TO utkarsh;

--
-- Name: TABLE user_meta; Type: COMMENT; Schema: public; Owner: utkarsh
--

COMMENT ON TABLE public.user_meta IS 'Table to store user related info';


--
-- Name: user_project_roles; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.user_project_roles (
    user_id bigint NOT NULL,
    project_id integer NOT NULL,
    role public.user_project_roles_role DEFAULT 'VIEWER'::public.user_project_roles_role NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_project_roles OWNER TO utkarsh;

--
-- Name: user_provider_connections; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.user_provider_connections (
    id integer NOT NULL,
    user_id bigint NOT NULL,
    provider public.user_provider_connections_provider NOT NULL,
    access_token character varying(255) NOT NULL,
    provider_user_id character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_provider_connections OWNER TO utkarsh;

--
-- Name: user_provider_connections_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.user_provider_connections ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.user_provider_connections_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user_team_roles; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.user_team_roles (
    user_id bigint NOT NULL,
    team_id integer NOT NULL,
    role public.user_team_roles_role DEFAULT 'MEMBER'::public.user_team_roles_role NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_team_roles OWNER TO utkarsh;

--
-- Name: users; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    team_id integer,
    email character varying(50) NOT NULL,
    meta text,
    is_oss boolean DEFAULT false NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    verified boolean DEFAULT false NOT NULL,
    password text,
    name character varying(30) NOT NULL,
    uuid character varying(50),
    github_user_id text
);


ALTER TABLE public.users OWNER TO utkarsh;

--
-- Name: users_id_seq1; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.users_id_seq1
    START WITH 1100
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: custom_codes id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.custom_codes ALTER COLUMN id SET DEFAULT nextval('public.custom_codes_id_seq'::regclass);


--
-- Name: tests_folder id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.tests_folder ALTER COLUMN id SET DEFAULT nextval('public.tests_folder_id_seq'::regclass);


--
-- Name: alerting idx_24693_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.alerting
    ADD CONSTRAINT idx_24693_primary PRIMARY KEY (user_id);


--
-- Name: comments idx_24704_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT idx_24704_primary PRIMARY KEY (id);


--
-- Name: environments idx_24712_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.environments
    ADD CONSTRAINT idx_24712_primary PRIMARY KEY (id);


--
-- Name: git_integrations idx_24719_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.git_integrations
    ADD CONSTRAINT idx_24719_primary PRIMARY KEY (id);


--
-- Name: integration_alerting idx_24735_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.integration_alerting
    ADD CONSTRAINT idx_24735_primary PRIMARY KEY (id);


--
-- Name: integrations idx_24743_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.integrations
    ADD CONSTRAINT idx_24743_primary PRIMARY KEY (id);


--
-- Name: job_reports idx_24751_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.job_reports
    ADD CONSTRAINT idx_24751_primary PRIMARY KEY (id);


--
-- Name: jobs idx_24760_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT idx_24760_primary PRIMARY KEY (id);


--
-- Name: monitorings idx_24771_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.monitorings
    ADD CONSTRAINT idx_24771_primary PRIMARY KEY (id);


--
-- Name: project_hosts idx_24778_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.project_hosts
    ADD CONSTRAINT idx_24778_primary PRIMARY KEY (id);


--
-- Name: projects idx_24786_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT idx_24786_primary PRIMARY KEY (id);


--
-- Name: teams idx_24795_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT idx_24795_primary PRIMARY KEY (id);


--
-- Name: templates idx_24804_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT idx_24804_primary PRIMARY KEY (id);


--
-- Name: test_instance_result_sets idx_24820_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instance_result_sets
    ADD CONSTRAINT idx_24820_primary PRIMARY KEY (id);


--
-- Name: test_instance_results idx_24829_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instance_results
    ADD CONSTRAINT idx_24829_primary PRIMARY KEY (id);


--
-- Name: test_instance_screenshots idx_24838_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instance_screenshots
    ADD CONSTRAINT idx_24838_primary PRIMARY KEY (id);


--
-- Name: test_instances idx_24847_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instances
    ADD CONSTRAINT idx_24847_primary PRIMARY KEY (id);


--
-- Name: tests idx_24857_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.tests
    ADD CONSTRAINT idx_24857_primary PRIMARY KEY (id);


--
-- Name: user_provider_connections idx_24878_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.user_provider_connections
    ADD CONSTRAINT idx_24878_primary PRIMARY KEY (id);


--
-- Name: users idx_24894_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT idx_24894_primary PRIMARY KEY (id);


--
-- Name: tests_folder tests_folder_pk; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.tests_folder
    ADD CONSTRAINT tests_folder_pk PRIMARY KEY (id);


--
-- Name: idx_24693_alerting_user_id_uindex; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE UNIQUE INDEX idx_24693_alerting_user_id_uindex ON public.alerting USING btree (user_id);


--
-- Name: idx_24704_comments_comments_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24704_comments_comments_id_fk ON public.comments USING btree (replied_to);


--
-- Name: idx_24704_comments_job_reports_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24704_comments_job_reports_id_fk ON public.comments USING btree (report_id);


--
-- Name: idx_24704_comments_test_instance_results_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24704_comments_test_instance_results_id_fk ON public.comments USING btree (result_id);


--
-- Name: idx_24704_comments_users_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24704_comments_users_id_fk ON public.comments USING btree (user_id);


--
-- Name: idx_24712_environments_projects_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24712_environments_projects_id_fk ON public.environments USING btree (project_id);


--
-- Name: idx_24712_environments_users_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24712_environments_users_id_fk ON public.environments USING btree (user_id);


--
-- Name: idx_24719_git_integrations_projects_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24719_git_integrations_projects_id_fk ON public.git_integrations USING btree (project_id);


--
-- Name: idx_24727_github_app_installations_ownername_reponame_index; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE UNIQUE INDEX idx_24727_github_app_installations_ownername_reponame_index ON public.github_app_installations USING btree (owner_name, repo_name);


--
-- Name: idx_24735_integration_alerting_projects_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24735_integration_alerting_projects_id_fk ON public.integration_alerting USING btree (project_id);


--
-- Name: idx_24751_job_reports_jobs_id_fk_2; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24751_job_reports_jobs_id_fk_2 ON public.job_reports USING btree (reference_job_id);


--
-- Name: idx_24751_job_reports_projects_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24751_job_reports_projects_id_fk ON public.job_reports USING btree (job_id);


--
-- Name: idx_24751_job_reports_projects_id_fk_1; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24751_job_reports_projects_id_fk_1 ON public.job_reports USING btree (project_id);


--
-- Name: idx_24760_build_search_index; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24760_build_search_index ON public.jobs USING btree (commit_name, repo_name, host);


--
-- Name: idx_24760_jobs_job_reports_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24760_jobs_job_reports_id_fk ON public.jobs USING btree (latest_report_id);


--
-- Name: idx_24760_jobs_projects_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24760_jobs_projects_id_fk ON public.jobs USING btree (project_id);


--
-- Name: idx_24760_jobs_users_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24760_jobs_users_id_fk ON public.jobs USING btree (user_id);


--
-- Name: idx_24771_monitoring_settings_projects_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24771_monitoring_settings_projects_id_fk ON public.monitorings USING btree (project_id);


--
-- Name: idx_24778_project_hosts_projects_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24778_project_hosts_projects_id_fk ON public.project_hosts USING btree (project_id);


--
-- Name: idx_24778_project_hosts_user_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24778_project_hosts_user_id_fk ON public.project_hosts USING btree (user_id);


--
-- Name: idx_24786_projects_jobs_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24786_projects_jobs_id_fk ON public.projects USING btree (baseline_job_id);


--
-- Name: idx_24786_projects_team_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24786_projects_team_id_fk ON public.projects USING btree (team_id);


--
-- Name: idx_24804_templates_projects_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24804_templates_projects_id_fk ON public.templates USING btree (project_id);


--
-- Name: idx_24804_templates_users_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24804_templates_users_id_fk ON public.templates USING btree (user_id);


--
-- Name: idx_24820_test_instance_result_sets_job_reports_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24820_test_instance_result_sets_job_reports_id_fk ON public.test_instance_result_sets USING btree (report_id);


--
-- Name: idx_24820_test_instance_result_sets_test_instances_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24820_test_instance_result_sets_test_instances_id_fk ON public.test_instance_result_sets USING btree (instance_id);


--
-- Name: idx_24820_test_instance_result_sets_test_instances_id_fk_2; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24820_test_instance_result_sets_test_instances_id_fk_2 ON public.test_instance_result_sets USING btree (target_instance_id);


--
-- Name: idx_24829_test_instance_results_test_instance_result_sets_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24829_test_instance_results_test_instance_result_sets_id_fk ON public.test_instance_results USING btree (instance_result_set_id);


--
-- Name: idx_24829_test_instance_results_test_instance_screenshots_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24829_test_instance_results_test_instance_screenshots_id_fk ON public.test_instance_results USING btree (target_screenshot_id);


--
-- Name: idx_24838_test_instance_screenshots_test_instance_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24838_test_instance_screenshots_test_instance_id_fk ON public.test_instance_screenshots USING btree (instance_id);


--
-- Name: idx_24847_test_instance_jobs_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24847_test_instance_jobs_id_fk ON public.test_instances USING btree (job_id);


--
-- Name: idx_24847_test_instance_tests_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24847_test_instance_tests_id_fk ON public.test_instances USING btree (test_id);


--
-- Name: idx_24857_tests_jobs_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24857_tests_jobs_id_fk ON public.tests USING btree (draft_job_id);


--
-- Name: idx_24857_tests_projects_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24857_tests_projects_id_fk ON public.tests USING btree (project_id);


--
-- Name: idx_24857_tests_users_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24857_tests_users_id_fk ON public.tests USING btree (user_id);


--
-- Name: idx_24866_user_meta___fk__user; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24866_user_meta___fk__user ON public.user_meta USING btree (user_id);


--
-- Name: idx_24872_user_project_roles_projects_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24872_user_project_roles_projects_id_fk ON public.user_project_roles USING btree (project_id);


--
-- Name: idx_24872_user_project_roles_users_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24872_user_project_roles_users_id_fk ON public.user_project_roles USING btree (user_id);


--
-- Name: idx_24878_user_provider_connections_users_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24878_user_provider_connections_users_id_fk ON public.user_provider_connections USING btree (user_id);


--
-- Name: idx_24886_user_team_roles_teams_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24886_user_team_roles_teams_id_fk ON public.user_team_roles USING btree (team_id);


--
-- Name: idx_24886_user_team_roles_users_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24886_user_team_roles_users_id_fk ON public.user_team_roles USING btree (user_id);


--
-- Name: idx_24894_user___fk_team_id; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24894_user___fk_team_id ON public.users USING btree (team_id);


--
-- Name: idx_24894_users_email_uindex; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE UNIQUE INDEX idx_24894_users_email_uindex ON public.users USING btree (email);


--
-- Name: environments on_update_current_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER on_update_current_timestamp BEFORE UPDATE ON public.environments FOR EACH ROW EXECUTE FUNCTION public.on_update_current_timestamp_environments();


--
-- Name: alerting trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.alerting FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: cli_status trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.cli_status FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: comments trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: environments trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.environments FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: git_integrations trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.git_integrations FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: github_app_installations trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.github_app_installations FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: integration_alerting trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.integration_alerting FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: integrations trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.integrations FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: job_reports trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.job_reports FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: jobs trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: monitorings trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.monitorings FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: project_hosts trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.project_hosts FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: projects trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: teams trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: templates trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.templates FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: test_instance_action_results trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.test_instance_action_results FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: test_instance_result_sets trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.test_instance_result_sets FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: test_instance_results trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.test_instance_results FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: test_instance_screenshots trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.test_instance_screenshots FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: test_instances trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.test_instances FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: tests trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.tests FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: user_project_roles trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.user_project_roles FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: user_provider_connections trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.user_provider_connections FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: user_team_roles trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.user_team_roles FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: users trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- Name: alerting alerting_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.alerting
    ADD CONSTRAINT alerting_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_comments_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_comments_id_fk FOREIGN KEY (replied_to) REFERENCES public.comments(id) ON UPDATE CASCADE;


--
-- Name: comments comments_job_reports_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_job_reports_id_fk FOREIGN KEY (report_id) REFERENCES public.job_reports(id) ON UPDATE CASCADE;


--
-- Name: comments comments_test_instance_results_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_test_instance_results_id_fk FOREIGN KEY (result_id) REFERENCES public.test_instance_results(id) ON UPDATE CASCADE;


--
-- Name: comments comments_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: custom_codes custom_codes_teams_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.custom_codes
    ADD CONSTRAINT custom_codes_teams_id_fk FOREIGN KEY (team_id) REFERENCES public.teams(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: git_integrations git_integrations_projects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.git_integrations
    ADD CONSTRAINT git_integrations_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE;


--
-- Name: integration_alerting integration_alerting_projects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.integration_alerting
    ADD CONSTRAINT integration_alerting_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE;


--
-- Name: job_reports job_reports_jobs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.job_reports
    ADD CONSTRAINT job_reports_jobs_id_fk FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: job_reports job_reports_jobs_id_fk_2; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.job_reports
    ADD CONSTRAINT job_reports_jobs_id_fk_2 FOREIGN KEY (reference_job_id) REFERENCES public.jobs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: jobs jobs_job_reports_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_job_reports_id_fk FOREIGN KEY (latest_report_id) REFERENCES public.job_reports(id) ON UPDATE CASCADE;


--
-- Name: project_hosts project_hosts_projects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.project_hosts
    ADD CONSTRAINT project_hosts_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE;


--
-- Name: project_hosts project_hosts_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.project_hosts
    ADD CONSTRAINT project_hosts_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: projects projects_jobs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_jobs_id_fk FOREIGN KEY (baseline_job_id) REFERENCES public.jobs(id) ON UPDATE CASCADE;


--
-- Name: projects projects_team_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_team_id_fk FOREIGN KEY (team_id) REFERENCES public.teams(id) ON UPDATE CASCADE;


--
-- Name: templates templates_projects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT templates_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE;


--
-- Name: templates templates_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT templates_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: test_instances test_instance_jobs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instances
    ADD CONSTRAINT test_instance_jobs_id_fk FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: test_instance_result_sets test_instance_result_sets_job_reports_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instance_result_sets
    ADD CONSTRAINT test_instance_result_sets_job_reports_id_fk FOREIGN KEY (report_id) REFERENCES public.job_reports(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: test_instance_result_sets test_instance_result_sets_test_instances_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instance_result_sets
    ADD CONSTRAINT test_instance_result_sets_test_instances_id_fk FOREIGN KEY (instance_id) REFERENCES public.test_instances(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: test_instance_result_sets test_instance_result_sets_test_instances_id_fk_2; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instance_result_sets
    ADD CONSTRAINT test_instance_result_sets_test_instances_id_fk_2 FOREIGN KEY (target_instance_id) REFERENCES public.test_instances(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: test_instance_results test_instance_results_test_instance_result_sets_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instance_results
    ADD CONSTRAINT test_instance_results_test_instance_result_sets_id_fk FOREIGN KEY (instance_result_set_id) REFERENCES public.test_instance_result_sets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: test_instance_results test_instance_results_test_instance_screenshots_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instance_results
    ADD CONSTRAINT test_instance_results_test_instance_screenshots_id_fk FOREIGN KEY (screenshot_id) REFERENCES public.test_instance_screenshots(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: test_instance_results test_instance_results_test_instance_screenshots_id_fk_2; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instance_results
    ADD CONSTRAINT test_instance_results_test_instance_screenshots_id_fk_2 FOREIGN KEY (target_screenshot_id) REFERENCES public.test_instance_screenshots(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: test_instances test_instance_tests_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instances
    ADD CONSTRAINT test_instance_tests_id_fk FOREIGN KEY (test_id) REFERENCES public.tests(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tests_folder tests_folder_projects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.tests_folder
    ADD CONSTRAINT tests_folder_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tests tests_jobs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.tests
    ADD CONSTRAINT tests_jobs_id_fk FOREIGN KEY (draft_job_id) REFERENCES public.jobs(id) ON UPDATE CASCADE;


--
-- Name: tests tests_tests_folder_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.tests
    ADD CONSTRAINT tests_tests_folder_id_fk FOREIGN KEY (test_folder) REFERENCES public.tests_folder(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users user___fk_team_id; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user___fk_team_id FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: user_meta user_meta___fk__user; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.user_meta
    ADD CONSTRAINT user_meta___fk__user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_project_roles user_project_roles_projects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.user_project_roles
    ADD CONSTRAINT user_project_roles_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE;


--
-- Name: user_project_roles user_project_roles_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.user_project_roles
    ADD CONSTRAINT user_project_roles_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: user_provider_connections user_provider_connections_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.user_provider_connections
    ADD CONSTRAINT user_provider_connections_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: user_team_roles user_team_roles_teams_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.user_team_roles
    ADD CONSTRAINT user_team_roles_teams_id_fk FOREIGN KEY (team_id) REFERENCES public.teams(id) ON UPDATE CASCADE;


--
-- Name: user_team_roles user_team_roles_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.user_team_roles
    ADD CONSTRAINT user_team_roles_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: TABLE alerting; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.alerting TO retool;


--
-- Name: TABLE cli_status; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.cli_status TO retool;


--
-- Name: TABLE comments; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.comments TO retool;


--
-- Name: TABLE environments; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.environments TO retool;


--
-- Name: TABLE git_integrations; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.git_integrations TO retool;


--
-- Name: TABLE github_app_installations; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.github_app_installations TO retool;


--
-- Name: TABLE integration_alerting; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.integration_alerting TO retool;


--
-- Name: TABLE integrations; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.integrations TO retool;


--
-- Name: TABLE job_reports; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.job_reports TO retool;


--
-- Name: TABLE jobs; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.jobs TO retool;


--
-- Name: TABLE monitorings; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.monitorings TO retool;


--
-- Name: TABLE project_hosts; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.project_hosts TO retool;


--
-- Name: TABLE projects; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.projects TO retool;


--
-- Name: TABLE teams; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.teams TO retool;


--
-- Name: TABLE templates; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.templates TO retool;


--
-- Name: TABLE test_instance_action_results; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.test_instance_action_results TO retool;


--
-- Name: TABLE test_instance_result_sets; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.test_instance_result_sets TO retool;


--
-- Name: TABLE test_instance_results; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.test_instance_results TO retool;


--
-- Name: TABLE test_instance_screenshots; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.test_instance_screenshots TO retool;


--
-- Name: TABLE test_instances; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.test_instances TO retool;


--
-- Name: TABLE tests; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.tests TO retool;


--
-- Name: TABLE user_meta; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.user_meta TO retool;


--
-- Name: TABLE user_project_roles; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.user_project_roles TO retool;


--
-- Name: TABLE user_provider_connections; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.user_provider_connections TO retool;


--
-- Name: TABLE user_team_roles; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.user_team_roles TO retool;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: utkarsh
--

GRANT SELECT ON TABLE public.users TO retool;


--
-- PostgreSQL database dump complete
--
