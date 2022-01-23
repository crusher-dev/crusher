--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.1 (Ubuntu 14.1-2.pgdg20.04+1)

-- Started on 2022-01-24 04:38:53 IST

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
-- TOC entry 868 (class 1247 OID 16418)
-- Name: cli_status_status; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.cli_status_status AS ENUM (
    'Started',
    'Completed'
);


ALTER TYPE public.cli_status_status OWNER TO utkarsh;

--
-- TOC entry 871 (class 1247 OID 16424)
-- Name: integrations_integration_name; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.integrations_integration_name AS ENUM (
    'SLACK'
);


ALTER TYPE public.integrations_integration_name OWNER TO utkarsh;

--
-- TOC entry 874 (class 1247 OID 16428)
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
-- TOC entry 877 (class 1247 OID 16438)
-- Name: jobs_build_trigger; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.jobs_build_trigger AS ENUM (
    'MANUAL',
    'CLI',
    'CRON'
);


ALTER TYPE public.jobs_build_trigger OWNER TO utkarsh;

--
-- TOC entry 880 (class 1247 OID 16446)
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
-- TOC entry 883 (class 1247 OID 16460)
-- Name: teams_tier; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.teams_tier AS ENUM (
    'FREE',
    'STARTER',
    'PRO'
);


ALTER TYPE public.teams_tier OWNER TO utkarsh;

--
-- TOC entry 886 (class 1247 OID 16468)
-- Name: test_instance_result_sets_conclusion; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.test_instance_result_sets_conclusion AS ENUM (
    'PASSED',
    'FAILED',
    'MANUAL_REVIEW_REQUIRED'
);


ALTER TYPE public.test_instance_result_sets_conclusion OWNER TO utkarsh;

--
-- TOC entry 889 (class 1247 OID 16476)
-- Name: test_instance_result_sets_status; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.test_instance_result_sets_status AS ENUM (
    'WAITING_FOR_TEST_EXECUTION',
    'RUNNING_CHECKS',
    'FINISHED_RUNNING_CHECKS'
);


ALTER TYPE public.test_instance_result_sets_status OWNER TO utkarsh;

--
-- TOC entry 892 (class 1247 OID 16484)
-- Name: test_instance_results_status; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.test_instance_results_status AS ENUM (
    'PASSED',
    'FAILED',
    'MANUAL_REVIEW_REQUIRED'
);


ALTER TYPE public.test_instance_results_status OWNER TO utkarsh;

--
-- TOC entry 895 (class 1247 OID 16492)
-- Name: test_instances_browser; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.test_instances_browser AS ENUM (
    'CHROME',
    'FIREFOX',
    'SAFARI'
);


ALTER TYPE public.test_instances_browser OWNER TO utkarsh;

--
-- TOC entry 898 (class 1247 OID 16500)
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
-- TOC entry 901 (class 1247 OID 16512)
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
-- TOC entry 904 (class 1247 OID 16522)
-- Name: user_provider_connections_provider; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.user_provider_connections_provider AS ENUM (
    'GITHUB',
    'GITLAB'
);


ALTER TYPE public.user_provider_connections_provider OWNER TO utkarsh;

--
-- TOC entry 907 (class 1247 OID 16528)
-- Name: user_team_roles_role; Type: TYPE; Schema: public; Owner: utkarsh
--

CREATE TYPE public.user_team_roles_role AS ENUM (
    'MEMBER',
    'ADMIN'
);


ALTER TYPE public.user_team_roles_role OWNER TO utkarsh;

--
-- TOC entry 266 (class 1255 OID 16533)
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
-- TOC entry 265 (class 1255 OID 16416)
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
-- TOC entry 209 (class 1259 OID 16534)
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
-- TOC entry 210 (class 1259 OID 16539)
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
-- TOC entry 211 (class 1259 OID 16545)
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
-- TOC entry 212 (class 1259 OID 16552)
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
-- TOC entry 213 (class 1259 OID 16553)
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
-- TOC entry 214 (class 1259 OID 16559)
-- Name: environments_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.environments ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.environments_id_seq
    START WITH 62
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 215 (class 1259 OID 16560)
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
-- TOC entry 216 (class 1259 OID 16567)
-- Name: git_integrations_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.git_integrations ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.git_integrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 217 (class 1259 OID 16568)
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
-- TOC entry 218 (class 1259 OID 16575)
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
-- TOC entry 219 (class 1259 OID 16582)
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
-- TOC entry 220 (class 1259 OID 16583)
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
-- TOC entry 4686 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE integrations; Type: COMMENT; Schema: public; Owner: utkarsh
--

COMMENT ON TABLE public.integrations IS 'This table and user_provider_connections should merge';


--
-- TOC entry 221 (class 1259 OID 16590)
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
-- TOC entry 222 (class 1259 OID 16591)
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
-- TOC entry 223 (class 1259 OID 16599)
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
-- TOC entry 224 (class 1259 OID 16600)
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
-- TOC entry 225 (class 1259 OID 16610)
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.jobs ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 226 (class 1259 OID 16611)
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
-- TOC entry 227 (class 1259 OID 16618)
-- Name: monitorings_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.monitorings ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.monitorings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 228 (class 1259 OID 16619)
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
-- TOC entry 229 (class 1259 OID 16626)
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
-- TOC entry 230 (class 1259 OID 16627)
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
    visual_baseline numeric DEFAULT 5 NOT NULL
);


ALTER TABLE public.projects OWNER TO utkarsh;

--
-- TOC entry 231 (class 1259 OID 16635)
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.projects ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 232 (class 1259 OID 16636)
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
    uuid character varying(50)
);


ALTER TABLE public.teams OWNER TO utkarsh;

--
-- TOC entry 233 (class 1259 OID 16644)
-- Name: teams_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.teams ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.teams_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 234 (class 1259 OID 16645)
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
-- TOC entry 235 (class 1259 OID 16652)
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
-- TOC entry 236 (class 1259 OID 16653)
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
-- TOC entry 237 (class 1259 OID 16660)
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
-- TOC entry 238 (class 1259 OID 16668)
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
-- TOC entry 239 (class 1259 OID 16669)
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
-- TOC entry 240 (class 1259 OID 16677)
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
-- TOC entry 241 (class 1259 OID 16678)
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
-- TOC entry 242 (class 1259 OID 16686)
-- Name: test_instance_screenshots_id_seq; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.test_instance_screenshots ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.test_instance_screenshots_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 243 (class 1259 OID 16687)
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
    meta text
);


ALTER TABLE public.test_instances OWNER TO utkarsh;

--
-- TOC entry 244 (class 1259 OID 16696)
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
-- TOC entry 245 (class 1259 OID 16697)
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
    run_after integer
);


ALTER TABLE public.tests OWNER TO utkarsh;

--
-- TOC entry 246 (class 1259 OID 16705)
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
-- TOC entry 247 (class 1259 OID 16706)
-- Name: user_meta; Type: TABLE; Schema: public; Owner: utkarsh
--

CREATE TABLE public.user_meta (
    user_id bigint NOT NULL,
    key character varying(255) NOT NULL,
    value character varying(400) NOT NULL
);


ALTER TABLE public.user_meta OWNER TO utkarsh;

--
-- TOC entry 4687 (class 0 OID 0)
-- Dependencies: 247
-- Name: TABLE user_meta; Type: COMMENT; Schema: public; Owner: utkarsh
--

COMMENT ON TABLE public.user_meta IS 'Table to store user related info';


--
-- TOC entry 248 (class 1259 OID 16711)
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
-- TOC entry 249 (class 1259 OID 16717)
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
-- TOC entry 250 (class 1259 OID 16724)
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
-- TOC entry 251 (class 1259 OID 16725)
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
-- TOC entry 252 (class 1259 OID 16731)
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
-- TOC entry 253 (class 1259 OID 16740)
-- Name: users_id_seq1; Type: SEQUENCE; Schema: public; Owner: utkarsh
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.users_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4402 (class 2606 OID 21552)
-- Name: alerting idx_24693_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.alerting
    ADD CONSTRAINT idx_24693_primary PRIMARY KEY (user_id);


--
-- TOC entry 4408 (class 2606 OID 21554)
-- Name: comments idx_24704_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT idx_24704_primary PRIMARY KEY (id);


--
-- TOC entry 4412 (class 2606 OID 21556)
-- Name: environments idx_24712_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.environments
    ADD CONSTRAINT idx_24712_primary PRIMARY KEY (id);


--
-- TOC entry 4415 (class 2606 OID 21558)
-- Name: git_integrations idx_24719_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.git_integrations
    ADD CONSTRAINT idx_24719_primary PRIMARY KEY (id);


--
-- TOC entry 4419 (class 2606 OID 21560)
-- Name: integration_alerting idx_24735_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.integration_alerting
    ADD CONSTRAINT idx_24735_primary PRIMARY KEY (id);


--
-- TOC entry 4421 (class 2606 OID 21562)
-- Name: integrations idx_24743_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.integrations
    ADD CONSTRAINT idx_24743_primary PRIMARY KEY (id);


--
-- TOC entry 4426 (class 2606 OID 21564)
-- Name: job_reports idx_24751_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.job_reports
    ADD CONSTRAINT idx_24751_primary PRIMARY KEY (id);


--
-- TOC entry 4432 (class 2606 OID 21566)
-- Name: jobs idx_24760_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT idx_24760_primary PRIMARY KEY (id);


--
-- TOC entry 4435 (class 2606 OID 21568)
-- Name: monitorings idx_24771_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.monitorings
    ADD CONSTRAINT idx_24771_primary PRIMARY KEY (id);


--
-- TOC entry 4437 (class 2606 OID 21570)
-- Name: project_hosts idx_24778_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.project_hosts
    ADD CONSTRAINT idx_24778_primary PRIMARY KEY (id);


--
-- TOC entry 4441 (class 2606 OID 21572)
-- Name: projects idx_24786_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT idx_24786_primary PRIMARY KEY (id);


--
-- TOC entry 4445 (class 2606 OID 21574)
-- Name: teams idx_24795_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT idx_24795_primary PRIMARY KEY (id);


--
-- TOC entry 4447 (class 2606 OID 21576)
-- Name: templates idx_24804_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT idx_24804_primary PRIMARY KEY (id);


--
-- TOC entry 4451 (class 2606 OID 21578)
-- Name: test_instance_result_sets idx_24820_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instance_result_sets
    ADD CONSTRAINT idx_24820_primary PRIMARY KEY (id);


--
-- TOC entry 4456 (class 2606 OID 21580)
-- Name: test_instance_results idx_24829_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instance_results
    ADD CONSTRAINT idx_24829_primary PRIMARY KEY (id);


--
-- TOC entry 4460 (class 2606 OID 21582)
-- Name: test_instance_screenshots idx_24838_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instance_screenshots
    ADD CONSTRAINT idx_24838_primary PRIMARY KEY (id);


--
-- TOC entry 4463 (class 2606 OID 21584)
-- Name: test_instances idx_24847_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instances
    ADD CONSTRAINT idx_24847_primary PRIMARY KEY (id);


--
-- TOC entry 4467 (class 2606 OID 21586)
-- Name: tests idx_24857_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.tests
    ADD CONSTRAINT idx_24857_primary PRIMARY KEY (id);


--
-- TOC entry 4476 (class 2606 OID 21588)
-- Name: user_provider_connections idx_24878_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.user_provider_connections
    ADD CONSTRAINT idx_24878_primary PRIMARY KEY (id);


--
-- TOC entry 4481 (class 2606 OID 21590)
-- Name: users idx_24894_primary; Type: CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT idx_24894_primary PRIMARY KEY (id);


--
-- TOC entry 4400 (class 1259 OID 21591)
-- Name: idx_24693_alerting_user_id_uindex; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE UNIQUE INDEX idx_24693_alerting_user_id_uindex ON public.alerting USING btree (user_id);


--
-- TOC entry 4403 (class 1259 OID 21592)
-- Name: idx_24704_comments_comments_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24704_comments_comments_id_fk ON public.comments USING btree (replied_to);


--
-- TOC entry 4404 (class 1259 OID 21593)
-- Name: idx_24704_comments_job_reports_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24704_comments_job_reports_id_fk ON public.comments USING btree (report_id);


--
-- TOC entry 4405 (class 1259 OID 21594)
-- Name: idx_24704_comments_test_instance_results_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24704_comments_test_instance_results_id_fk ON public.comments USING btree (result_id);


--
-- TOC entry 4406 (class 1259 OID 21595)
-- Name: idx_24704_comments_users_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24704_comments_users_id_fk ON public.comments USING btree (user_id);


--
-- TOC entry 4409 (class 1259 OID 21596)
-- Name: idx_24712_environments_projects_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24712_environments_projects_id_fk ON public.environments USING btree (project_id);


--
-- TOC entry 4410 (class 1259 OID 21597)
-- Name: idx_24712_environments_users_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24712_environments_users_id_fk ON public.environments USING btree (user_id);


--
-- TOC entry 4413 (class 1259 OID 21598)
-- Name: idx_24719_git_integrations_projects_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24719_git_integrations_projects_id_fk ON public.git_integrations USING btree (project_id);


--
-- TOC entry 4416 (class 1259 OID 21599)
-- Name: idx_24727_github_app_installations_ownername_reponame_index; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE UNIQUE INDEX idx_24727_github_app_installations_ownername_reponame_index ON public.github_app_installations USING btree (owner_name, repo_name);


--
-- TOC entry 4417 (class 1259 OID 21600)
-- Name: idx_24735_integration_alerting_projects_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24735_integration_alerting_projects_id_fk ON public.integration_alerting USING btree (project_id);


--
-- TOC entry 4422 (class 1259 OID 21601)
-- Name: idx_24751_job_reports_jobs_id_fk_2; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24751_job_reports_jobs_id_fk_2 ON public.job_reports USING btree (reference_job_id);


--
-- TOC entry 4423 (class 1259 OID 21602)
-- Name: idx_24751_job_reports_projects_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24751_job_reports_projects_id_fk ON public.job_reports USING btree (job_id);


--
-- TOC entry 4424 (class 1259 OID 21603)
-- Name: idx_24751_job_reports_projects_id_fk_1; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24751_job_reports_projects_id_fk_1 ON public.job_reports USING btree (project_id);


--
-- TOC entry 4427 (class 1259 OID 21604)
-- Name: idx_24760_build_search_index; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24760_build_search_index ON public.jobs USING btree (commit_name, repo_name, host);


--
-- TOC entry 4428 (class 1259 OID 21605)
-- Name: idx_24760_jobs_job_reports_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24760_jobs_job_reports_id_fk ON public.jobs USING btree (latest_report_id);


--
-- TOC entry 4429 (class 1259 OID 21606)
-- Name: idx_24760_jobs_projects_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24760_jobs_projects_id_fk ON public.jobs USING btree (project_id);


--
-- TOC entry 4430 (class 1259 OID 21607)
-- Name: idx_24760_jobs_users_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24760_jobs_users_id_fk ON public.jobs USING btree (user_id);


--
-- TOC entry 4433 (class 1259 OID 21608)
-- Name: idx_24771_monitoring_settings_projects_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24771_monitoring_settings_projects_id_fk ON public.monitorings USING btree (project_id);


--
-- TOC entry 4438 (class 1259 OID 21609)
-- Name: idx_24778_project_hosts_projects_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24778_project_hosts_projects_id_fk ON public.project_hosts USING btree (project_id);


--
-- TOC entry 4439 (class 1259 OID 21610)
-- Name: idx_24778_project_hosts_user_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24778_project_hosts_user_id_fk ON public.project_hosts USING btree (user_id);


--
-- TOC entry 4442 (class 1259 OID 21611)
-- Name: idx_24786_projects_jobs_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24786_projects_jobs_id_fk ON public.projects USING btree (baseline_job_id);


--
-- TOC entry 4443 (class 1259 OID 21612)
-- Name: idx_24786_projects_team_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24786_projects_team_id_fk ON public.projects USING btree (team_id);


--
-- TOC entry 4448 (class 1259 OID 21613)
-- Name: idx_24804_templates_projects_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24804_templates_projects_id_fk ON public.templates USING btree (project_id);


--
-- TOC entry 4449 (class 1259 OID 21614)
-- Name: idx_24804_templates_users_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24804_templates_users_id_fk ON public.templates USING btree (user_id);


--
-- TOC entry 4452 (class 1259 OID 21615)
-- Name: idx_24820_test_instance_result_sets_job_reports_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24820_test_instance_result_sets_job_reports_id_fk ON public.test_instance_result_sets USING btree (report_id);


--
-- TOC entry 4453 (class 1259 OID 21616)
-- Name: idx_24820_test_instance_result_sets_test_instances_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24820_test_instance_result_sets_test_instances_id_fk ON public.test_instance_result_sets USING btree (instance_id);


--
-- TOC entry 4454 (class 1259 OID 21617)
-- Name: idx_24820_test_instance_result_sets_test_instances_id_fk_2; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24820_test_instance_result_sets_test_instances_id_fk_2 ON public.test_instance_result_sets USING btree (target_instance_id);


--
-- TOC entry 4457 (class 1259 OID 21618)
-- Name: idx_24829_test_instance_results_test_instance_result_sets_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24829_test_instance_results_test_instance_result_sets_id_fk ON public.test_instance_results USING btree (instance_result_set_id);


--
-- TOC entry 4458 (class 1259 OID 21619)
-- Name: idx_24829_test_instance_results_test_instance_screenshots_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24829_test_instance_results_test_instance_screenshots_id_fk ON public.test_instance_results USING btree (target_screenshot_id);


--
-- TOC entry 4461 (class 1259 OID 21620)
-- Name: idx_24838_test_instance_screenshots_test_instance_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24838_test_instance_screenshots_test_instance_id_fk ON public.test_instance_screenshots USING btree (instance_id);


--
-- TOC entry 4464 (class 1259 OID 21621)
-- Name: idx_24847_test_instance_jobs_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24847_test_instance_jobs_id_fk ON public.test_instances USING btree (job_id);


--
-- TOC entry 4465 (class 1259 OID 21622)
-- Name: idx_24847_test_instance_tests_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24847_test_instance_tests_id_fk ON public.test_instances USING btree (test_id);


--
-- TOC entry 4468 (class 1259 OID 21623)
-- Name: idx_24857_test_search_index; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24857_test_search_index ON public.tests USING gin (to_tsvector('simple'::regconfig, (name)::text));


--
-- TOC entry 4469 (class 1259 OID 21624)
-- Name: idx_24857_tests_jobs_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24857_tests_jobs_id_fk ON public.tests USING btree (draft_job_id);


--
-- TOC entry 4470 (class 1259 OID 21625)
-- Name: idx_24857_tests_projects_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24857_tests_projects_id_fk ON public.tests USING btree (project_id);


--
-- TOC entry 4471 (class 1259 OID 21626)
-- Name: idx_24857_tests_users_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24857_tests_users_id_fk ON public.tests USING btree (user_id);


--
-- TOC entry 4472 (class 1259 OID 21627)
-- Name: idx_24866_user_meta___fk__user; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24866_user_meta___fk__user ON public.user_meta USING btree (user_id);


--
-- TOC entry 4473 (class 1259 OID 21628)
-- Name: idx_24872_user_project_roles_projects_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24872_user_project_roles_projects_id_fk ON public.user_project_roles USING btree (project_id);


--
-- TOC entry 4474 (class 1259 OID 21629)
-- Name: idx_24872_user_project_roles_users_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24872_user_project_roles_users_id_fk ON public.user_project_roles USING btree (user_id);


--
-- TOC entry 4477 (class 1259 OID 21630)
-- Name: idx_24878_user_provider_connections_users_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24878_user_provider_connections_users_id_fk ON public.user_provider_connections USING btree (user_id);


--
-- TOC entry 4478 (class 1259 OID 21631)
-- Name: idx_24886_user_team_roles_teams_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24886_user_team_roles_teams_id_fk ON public.user_team_roles USING btree (team_id);


--
-- TOC entry 4479 (class 1259 OID 21632)
-- Name: idx_24886_user_team_roles_users_id_fk; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24886_user_team_roles_users_id_fk ON public.user_team_roles USING btree (user_id);


--
-- TOC entry 4482 (class 1259 OID 21633)
-- Name: idx_24894_user___fk_team_id; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE INDEX idx_24894_user___fk_team_id ON public.users USING btree (team_id);


--
-- TOC entry 4483 (class 1259 OID 21634)
-- Name: idx_24894_users_email_uindex; Type: INDEX; Schema: public; Owner: utkarsh
--

CREATE UNIQUE INDEX idx_24894_users_email_uindex ON public.users USING btree (email);


--
-- TOC entry 4519 (class 2620 OID 21635)
-- Name: environments on_update_current_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER on_update_current_timestamp BEFORE UPDATE ON public.environments FOR EACH ROW EXECUTE FUNCTION public.on_update_current_timestamp_environments();


--
-- TOC entry 4516 (class 2620 OID 21636)
-- Name: alerting trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.alerting FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4517 (class 2620 OID 21637)
-- Name: cli_status trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.cli_status FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4518 (class 2620 OID 21638)
-- Name: comments trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4520 (class 2620 OID 21639)
-- Name: environments trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.environments FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4521 (class 2620 OID 21640)
-- Name: git_integrations trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.git_integrations FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4522 (class 2620 OID 21641)
-- Name: github_app_installations trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.github_app_installations FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4523 (class 2620 OID 21642)
-- Name: integration_alerting trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.integration_alerting FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4524 (class 2620 OID 21643)
-- Name: integrations trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.integrations FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4525 (class 2620 OID 21644)
-- Name: job_reports trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.job_reports FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4526 (class 2620 OID 21645)
-- Name: jobs trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4527 (class 2620 OID 21646)
-- Name: monitorings trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.monitorings FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4528 (class 2620 OID 21647)
-- Name: project_hosts trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.project_hosts FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4529 (class 2620 OID 21648)
-- Name: projects trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4530 (class 2620 OID 21649)
-- Name: teams trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4531 (class 2620 OID 21650)
-- Name: templates trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.templates FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4532 (class 2620 OID 21651)
-- Name: test_instance_action_results trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.test_instance_action_results FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4533 (class 2620 OID 21652)
-- Name: test_instance_result_sets trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.test_instance_result_sets FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4534 (class 2620 OID 21653)
-- Name: test_instance_results trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.test_instance_results FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4535 (class 2620 OID 21654)
-- Name: test_instance_screenshots trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.test_instance_screenshots FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4536 (class 2620 OID 21655)
-- Name: test_instances trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.test_instances FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4537 (class 2620 OID 21656)
-- Name: tests trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.tests FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4538 (class 2620 OID 21657)
-- Name: user_project_roles trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.user_project_roles FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4539 (class 2620 OID 21658)
-- Name: user_provider_connections trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.user_provider_connections FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4540 (class 2620 OID 21659)
-- Name: user_team_roles trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.user_team_roles FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4541 (class 2620 OID 21660)
-- Name: users trigger_update_timestamp; Type: TRIGGER; Schema: public; Owner: utkarsh
--

CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.updated_timestamp_func();


--
-- TOC entry 4484 (class 2606 OID 21661)
-- Name: alerting alerting_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.alerting
    ADD CONSTRAINT alerting_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4485 (class 2606 OID 21666)
-- Name: comments comments_comments_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_comments_id_fk FOREIGN KEY (replied_to) REFERENCES public.comments(id) ON UPDATE CASCADE;


--
-- TOC entry 4486 (class 2606 OID 21671)
-- Name: comments comments_job_reports_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_job_reports_id_fk FOREIGN KEY (report_id) REFERENCES public.job_reports(id) ON UPDATE CASCADE;


--
-- TOC entry 4487 (class 2606 OID 21676)
-- Name: comments comments_test_instance_results_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_test_instance_results_id_fk FOREIGN KEY (result_id) REFERENCES public.test_instance_results(id) ON UPDATE CASCADE;


--
-- TOC entry 4488 (class 2606 OID 21681)
-- Name: comments comments_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- TOC entry 4489 (class 2606 OID 21696)
-- Name: git_integrations git_integrations_projects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.git_integrations
    ADD CONSTRAINT git_integrations_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE;


--
-- TOC entry 4490 (class 2606 OID 21701)
-- Name: integration_alerting integration_alerting_projects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.integration_alerting
    ADD CONSTRAINT integration_alerting_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE;


--
-- TOC entry 4491 (class 2606 OID 21706)
-- Name: job_reports job_reports_jobs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.job_reports
    ADD CONSTRAINT job_reports_jobs_id_fk FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON UPDATE CASCADE;


--
-- TOC entry 4492 (class 2606 OID 21711)
-- Name: job_reports job_reports_jobs_id_fk_2; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.job_reports
    ADD CONSTRAINT job_reports_jobs_id_fk_2 FOREIGN KEY (reference_job_id) REFERENCES public.jobs(id) ON UPDATE CASCADE;


--
-- TOC entry 4493 (class 2606 OID 21721)
-- Name: jobs jobs_job_reports_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_job_reports_id_fk FOREIGN KEY (latest_report_id) REFERENCES public.job_reports(id) ON UPDATE CASCADE;


--
-- TOC entry 4494 (class 2606 OID 21741)
-- Name: project_hosts project_hosts_projects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.project_hosts
    ADD CONSTRAINT project_hosts_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE;


--
-- TOC entry 4495 (class 2606 OID 21746)
-- Name: project_hosts project_hosts_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.project_hosts
    ADD CONSTRAINT project_hosts_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- TOC entry 4496 (class 2606 OID 21751)
-- Name: projects projects_jobs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_jobs_id_fk FOREIGN KEY (baseline_job_id) REFERENCES public.jobs(id) ON UPDATE CASCADE;


--
-- TOC entry 4497 (class 2606 OID 21756)
-- Name: projects projects_team_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_team_id_fk FOREIGN KEY (team_id) REFERENCES public.teams(id) ON UPDATE CASCADE;


--
-- TOC entry 4498 (class 2606 OID 21761)
-- Name: templates templates_projects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT templates_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE;


--
-- TOC entry 4499 (class 2606 OID 21766)
-- Name: templates templates_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT templates_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- TOC entry 4506 (class 2606 OID 21771)
-- Name: test_instances test_instance_jobs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instances
    ADD CONSTRAINT test_instance_jobs_id_fk FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON UPDATE CASCADE;


--
-- TOC entry 4500 (class 2606 OID 21776)
-- Name: test_instance_result_sets test_instance_result_sets_job_reports_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instance_result_sets
    ADD CONSTRAINT test_instance_result_sets_job_reports_id_fk FOREIGN KEY (report_id) REFERENCES public.job_reports(id) ON UPDATE CASCADE;


--
-- TOC entry 4501 (class 2606 OID 21781)
-- Name: test_instance_result_sets test_instance_result_sets_test_instances_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instance_result_sets
    ADD CONSTRAINT test_instance_result_sets_test_instances_id_fk FOREIGN KEY (instance_id) REFERENCES public.test_instances(id) ON UPDATE CASCADE;


--
-- TOC entry 4502 (class 2606 OID 21786)
-- Name: test_instance_result_sets test_instance_result_sets_test_instances_id_fk_2; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instance_result_sets
    ADD CONSTRAINT test_instance_result_sets_test_instances_id_fk_2 FOREIGN KEY (target_instance_id) REFERENCES public.test_instances(id) ON UPDATE CASCADE;


--
-- TOC entry 4503 (class 2606 OID 21791)
-- Name: test_instance_results test_instance_results_test_instance_result_sets_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instance_results
    ADD CONSTRAINT test_instance_results_test_instance_result_sets_id_fk FOREIGN KEY (instance_result_set_id) REFERENCES public.test_instance_result_sets(id) ON UPDATE CASCADE;


--
-- TOC entry 4504 (class 2606 OID 21796)
-- Name: test_instance_results test_instance_results_test_instance_screenshots_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instance_results
    ADD CONSTRAINT test_instance_results_test_instance_screenshots_id_fk FOREIGN KEY (screenshot_id) REFERENCES public.test_instance_screenshots(id) ON UPDATE CASCADE;


--
-- TOC entry 4505 (class 2606 OID 21801)
-- Name: test_instance_results test_instance_results_test_instance_screenshots_id_fk_2; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instance_results
    ADD CONSTRAINT test_instance_results_test_instance_screenshots_id_fk_2 FOREIGN KEY (target_screenshot_id) REFERENCES public.test_instance_screenshots(id) ON UPDATE CASCADE;


--
-- TOC entry 4507 (class 2606 OID 21811)
-- Name: test_instances test_instance_tests_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.test_instances
    ADD CONSTRAINT test_instance_tests_id_fk FOREIGN KEY (test_id) REFERENCES public.tests(id) ON UPDATE CASCADE;


--
-- TOC entry 4508 (class 2606 OID 21816)
-- Name: tests tests_jobs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.tests
    ADD CONSTRAINT tests_jobs_id_fk FOREIGN KEY (draft_job_id) REFERENCES public.jobs(id) ON UPDATE CASCADE;


--
-- TOC entry 4515 (class 2606 OID 21831)
-- Name: users user___fk_team_id; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user___fk_team_id FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- TOC entry 4509 (class 2606 OID 21838)
-- Name: user_meta user_meta___fk__user; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.user_meta
    ADD CONSTRAINT user_meta___fk__user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4510 (class 2606 OID 21849)
-- Name: user_project_roles user_project_roles_projects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.user_project_roles
    ADD CONSTRAINT user_project_roles_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE;


--
-- TOC entry 4511 (class 2606 OID 21854)
-- Name: user_project_roles user_project_roles_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.user_project_roles
    ADD CONSTRAINT user_project_roles_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- TOC entry 4512 (class 2606 OID 21859)
-- Name: user_provider_connections user_provider_connections_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.user_provider_connections
    ADD CONSTRAINT user_provider_connections_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- TOC entry 4513 (class 2606 OID 21864)
-- Name: user_team_roles user_team_roles_teams_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.user_team_roles
    ADD CONSTRAINT user_team_roles_teams_id_fk FOREIGN KEY (team_id) REFERENCES public.teams(id) ON UPDATE CASCADE;


--
-- TOC entry 4514 (class 2606 OID 21869)
-- Name: user_team_roles user_team_roles_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: utkarsh
--

ALTER TABLE ONLY public.user_team_roles
    ADD CONSTRAINT user_team_roles_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


-- Completed on 2022-01-24 04:40:15 IST

--
-- PostgreSQL database dump complete
--

