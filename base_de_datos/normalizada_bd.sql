--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2024-09-29 19:11:41

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 17412)
-- Name: course_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_requests (
    request_id integer NOT NULL,
    course_name character varying(255) NOT NULL,
    credits integer NOT NULL,
    request_status character varying(50),
    school_id integer NOT NULL,
    year_id integer NOT NULL,
    CONSTRAINT course_requests_credits_check CHECK ((credits > 0)),
    CONSTRAINT course_requests_request_status_check CHECK (((request_status)::text = ANY ((ARRAY['pendiente'::character varying, 'aprobado'::character varying, 'rechazado'::character varying])::text[])))
);


ALTER TABLE public.course_requests OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17411)
-- Name: course_requests_request_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.course_requests_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_requests_request_id_seq OWNER TO postgres;

--
-- TOC entry 4872 (class 0 OID 0)
-- Dependencies: 219
-- Name: course_requests_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.course_requests_request_id_seq OWNED BY public.course_requests.request_id;


--
-- TOC entry 222 (class 1259 OID 17431)
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    course_id integer NOT NULL,
    course_name character varying(255) NOT NULL,
    credits integer NOT NULL,
    semester_id integer NOT NULL,
    code character varying,
    CONSTRAINT courses_credits_check CHECK ((credits > 0))
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17430)
-- Name: courses_course_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.courses_course_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courses_course_id_seq OWNER TO postgres;

--
-- TOC entry 4873 (class 0 OID 0)
-- Dependencies: 221
-- Name: courses_course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.courses_course_id_seq OWNED BY public.courses.course_id;


--
-- TOC entry 229 (class 1259 OID 17538)
-- Name: school_courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_courses (
    school_id integer NOT NULL,
    course_id integer NOT NULL
);


ALTER TABLE public.school_courses OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 17400)
-- Name: schools; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schools (
    school_id integer NOT NULL,
    school_name character varying(255) NOT NULL,
    year_id integer NOT NULL
);


ALTER TABLE public.schools OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 17399)
-- Name: schools_school_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.schools_school_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.schools_school_id_seq OWNER TO postgres;

--
-- TOC entry 4874 (class 0 OID 0)
-- Dependencies: 217
-- Name: schools_school_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.schools_school_id_seq OWNED BY public.schools.school_id;


--
-- TOC entry 226 (class 1259 OID 17461)
-- Name: semesters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.semesters (
    semester_id integer NOT NULL,
    semester_name character varying(20) NOT NULL,
    year_id integer NOT NULL,
    CONSTRAINT semesters_semester_name_check CHECK (((semester_name)::text = ANY ((ARRAY['Primero'::character varying, 'Segundo'::character varying])::text[])))
);


ALTER TABLE public.semesters OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 17460)
-- Name: semesters_semester_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.semesters_semester_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.semesters_semester_id_seq OWNER TO postgres;

--
-- TOC entry 4875 (class 0 OID 0)
-- Dependencies: 225
-- Name: semesters_semester_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.semesters_semester_id_seq OWNED BY public.semesters.semester_id;


--
-- TOC entry 228 (class 1259 OID 17474)
-- Name: teacher_course_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teacher_course_assignments (
    assignment_id integer NOT NULL,
    teacher_id integer NOT NULL,
    course_id integer NOT NULL,
    assigned_date date NOT NULL,
    semester_id integer NOT NULL
);


ALTER TABLE public.teacher_course_assignments OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 17473)
-- Name: teacher_course_assignments_assignment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teacher_course_assignments_assignment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teacher_course_assignments_assignment_id_seq OWNER TO postgres;

--
-- TOC entry 4876 (class 0 OID 0)
-- Dependencies: 227
-- Name: teacher_course_assignments_assignment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teacher_course_assignments_assignment_id_seq OWNED BY public.teacher_course_assignments.assignment_id;


--
-- TOC entry 224 (class 1259 OID 17449)
-- Name: teachers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teachers (
    teacher_id integer NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone_number character varying(20),
    max_credits integer NOT NULL,
    rut_login character varying,
    password character varying,
    contract character varying,
    CONSTRAINT teachers_max_credits_check CHECK ((max_credits > 0))
);


ALTER TABLE public.teachers OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 17448)
-- Name: teachers_teacher_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teachers_teacher_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teachers_teacher_id_seq OWNER TO postgres;

--
-- TOC entry 4877 (class 0 OID 0)
-- Dependencies: 223
-- Name: teachers_teacher_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teachers_teacher_id_seq OWNED BY public.teachers.teacher_id;


--
-- TOC entry 216 (class 1259 OID 17393)
-- Name: years; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.years (
    year_id integer NOT NULL,
    year_name character varying(4) NOT NULL
);


ALTER TABLE public.years OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 17392)
-- Name: years_year_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.years_year_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.years_year_id_seq OWNER TO postgres;

--
-- TOC entry 4878 (class 0 OID 0)
-- Dependencies: 215
-- Name: years_year_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.years_year_id_seq OWNED BY public.years.year_id;


--
-- TOC entry 4670 (class 2604 OID 17415)
-- Name: course_requests request_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_requests ALTER COLUMN request_id SET DEFAULT nextval('public.course_requests_request_id_seq'::regclass);


--
-- TOC entry 4671 (class 2604 OID 17434)
-- Name: courses course_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses ALTER COLUMN course_id SET DEFAULT nextval('public.courses_course_id_seq'::regclass);


--
-- TOC entry 4669 (class 2604 OID 17403)
-- Name: schools school_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schools ALTER COLUMN school_id SET DEFAULT nextval('public.schools_school_id_seq'::regclass);


--
-- TOC entry 4673 (class 2604 OID 17464)
-- Name: semesters semester_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semesters ALTER COLUMN semester_id SET DEFAULT nextval('public.semesters_semester_id_seq'::regclass);


--
-- TOC entry 4674 (class 2604 OID 17477)
-- Name: teacher_course_assignments assignment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_course_assignments ALTER COLUMN assignment_id SET DEFAULT nextval('public.teacher_course_assignments_assignment_id_seq'::regclass);


--
-- TOC entry 4672 (class 2604 OID 17452)
-- Name: teachers teacher_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers ALTER COLUMN teacher_id SET DEFAULT nextval('public.teachers_teacher_id_seq'::regclass);


--
-- TOC entry 4668 (class 2604 OID 17396)
-- Name: years year_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.years ALTER COLUMN year_id SET DEFAULT nextval('public.years_year_id_seq'::regclass);


--
-- TOC entry 4857 (class 0 OID 17412)
-- Dependencies: 220
-- Data for Name: course_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_requests (request_id, course_name, credits, request_status, school_id, year_id) FROM stdin;
1	Matemáticas I	5	pendiente	1	1
2	Programación Básica	6	aprobado	1	1
3	Historia del Arte	4	rechazado	2	1
4	Física General	5	pendiente	2	1
5	Literatura Universal	3	aprobado	3	1
\.


--
-- TOC entry 4859 (class 0 OID 17431)
-- Dependencies: 222
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (course_id, course_name, credits, semester_id, code) FROM stdin;
66	TALLER DE INGENIERÍA II	5	1	IOCC038-17
67	TALLER DE MATERIALES DE CONSTRUCCIÓN	6	1	IOCC075-18
68	TALLER DE GEOMETRÍA DESCRIPTIVA	5	1	IOCC079-18
69	MECÁNICA RACIONAL	7	1	IOCC085-18
70	TALLER DE URBANIZACIÓN	4	1	IOCC088-18
71	TALLER DE DIBUJO EN INGENIERÍA	6	1	IOCC104-18
72	MECÁNICA RACIONAL ESTÁTICA	5	1	IOCC109-18
73	TALLER DE INTRODUCCIÓN A LOS PROCESOS CONSTRUCTIVOS	6	1	IOCC119-18
74	ANÁLISIS DE ESTRUCTURAS	7	1	IOCC129-18
75	MECÁNICA DE SUELOS Y LABORATORIO	5	1	IOCC146-18
76	EDIFICACIÓN EN OBRA GRUESA	6	1	IOCC153-18
77	GESTIÓN DE OPERACIONES EN LA CONSTRUCCIÓN	4	1	IOCC156-13
78	HIDRÁULICA	6	1	IOCC157-18
79	TOPOGRAFÍA GENERAL	7	1	IOCC165-18
\.


--
-- TOC entry 4866 (class 0 OID 17538)
-- Dependencies: 229
-- Data for Name: school_courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.school_courses (school_id, course_id) FROM stdin;
\.


--
-- TOC entry 4855 (class 0 OID 17400)
-- Dependencies: 218
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schools (school_id, school_name, year_id) FROM stdin;
1	Bachillerato	1
2	Obras Civiles	1
3	Construcción	1
\.


--
-- TOC entry 4863 (class 0 OID 17461)
-- Dependencies: 226
-- Data for Name: semesters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.semesters (semester_id, semester_name, year_id) FROM stdin;
1	Primero	1
2	Segundo	1
3	Primero	2
4	Segundo	2
5	Primero	3
\.


--
-- TOC entry 4865 (class 0 OID 17474)
-- Dependencies: 228
-- Data for Name: teacher_course_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher_course_assignments (assignment_id, teacher_id, course_id, assigned_date, semester_id) FROM stdin;
\.


--
-- TOC entry 4861 (class 0 OID 17449)
-- Dependencies: 224
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teachers (teacher_id, first_name, last_name, email, phone_number, max_credits, rut_login, password, contract) FROM stdin;
1	Juan	Pérez	juan.perez@uach.cl	123456789	20	12345678-9	password1	Contrato A
2	María	González	maria.gonzalez@uach.cl	987654321	25	98765432-1	password2	Contrato B
3	Luis	Rodríguez	luis.rodriguez@uach.cl	456123789	15	45678912-3	password3	Contrato C
4	Ana	Martínez	ana.martinez@uach.cl	321654987	30	32165498-7	password4	Contrato D
5	Carlos	Hernández	carlos.hernandez@uach.cl	654321987	10	65432112-5	password5	Contrato E
\.


--
-- TOC entry 4853 (class 0 OID 17393)
-- Dependencies: 216
-- Data for Name: years; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.years (year_id, year_name) FROM stdin;
1	2023
2	2024
3	2025
4	2026
5	2027
\.


--
-- TOC entry 4879 (class 0 OID 0)
-- Dependencies: 219
-- Name: course_requests_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.course_requests_request_id_seq', 1, false);


--
-- TOC entry 4880 (class 0 OID 0)
-- Dependencies: 221
-- Name: courses_course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_course_id_seq', 79, true);


--
-- TOC entry 4881 (class 0 OID 0)
-- Dependencies: 217
-- Name: schools_school_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schools_school_id_seq', 1, true);


--
-- TOC entry 4882 (class 0 OID 0)
-- Dependencies: 225
-- Name: semesters_semester_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.semesters_semester_id_seq', 1, false);


--
-- TOC entry 4883 (class 0 OID 0)
-- Dependencies: 227
-- Name: teacher_course_assignments_assignment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teacher_course_assignments_assignment_id_seq', 1, false);


--
-- TOC entry 4884 (class 0 OID 0)
-- Dependencies: 223
-- Name: teachers_teacher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teachers_teacher_id_seq', 1, false);


--
-- TOC entry 4885 (class 0 OID 0)
-- Dependencies: 215
-- Name: years_year_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.years_year_id_seq', 1, false);


--
-- TOC entry 4685 (class 2606 OID 17419)
-- Name: course_requests course_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_requests
    ADD CONSTRAINT course_requests_pkey PRIMARY KEY (request_id);


--
-- TOC entry 4687 (class 2606 OID 17437)
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (course_id);


--
-- TOC entry 4698 (class 2606 OID 17542)
-- Name: school_courses school_courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_courses
    ADD CONSTRAINT school_courses_pkey PRIMARY KEY (school_id, course_id);


--
-- TOC entry 4683 (class 2606 OID 17405)
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (school_id);


--
-- TOC entry 4694 (class 2606 OID 17467)
-- Name: semesters semesters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semesters
    ADD CONSTRAINT semesters_pkey PRIMARY KEY (semester_id);


--
-- TOC entry 4696 (class 2606 OID 17479)
-- Name: teacher_course_assignments teacher_course_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_course_assignments
    ADD CONSTRAINT teacher_course_assignments_pkey PRIMARY KEY (assignment_id);


--
-- TOC entry 4690 (class 2606 OID 17459)
-- Name: teachers teachers_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_email_key UNIQUE (email);


--
-- TOC entry 4692 (class 2606 OID 17457)
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (teacher_id);


--
-- TOC entry 4681 (class 2606 OID 17398)
-- Name: years years_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.years
    ADD CONSTRAINT years_pkey PRIMARY KEY (year_id);


--
-- TOC entry 4688 (class 1259 OID 17500)
-- Name: fki_semester_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_semester_id ON public.courses USING btree (semester_id);


--
-- TOC entry 4700 (class 2606 OID 17420)
-- Name: course_requests course_requests_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_requests
    ADD CONSTRAINT course_requests_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(school_id) ON DELETE CASCADE;


--
-- TOC entry 4701 (class 2606 OID 17425)
-- Name: course_requests course_requests_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_requests
    ADD CONSTRAINT course_requests_year_id_fkey FOREIGN KEY (year_id) REFERENCES public.years(year_id) ON DELETE CASCADE;


--
-- TOC entry 4707 (class 2606 OID 17548)
-- Name: school_courses fk_course; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_courses
    ADD CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES public.courses(course_id) ON DELETE CASCADE;


--
-- TOC entry 4708 (class 2606 OID 17543)
-- Name: school_courses fk_school; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_courses
    ADD CONSTRAINT fk_school FOREIGN KEY (school_id) REFERENCES public.schools(school_id) ON DELETE CASCADE;


--
-- TOC entry 4699 (class 2606 OID 17406)
-- Name: schools schools_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_year_id_fkey FOREIGN KEY (year_id) REFERENCES public.years(year_id) ON DELETE CASCADE;


--
-- TOC entry 4702 (class 2606 OID 17495)
-- Name: courses semester_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT semester_id FOREIGN KEY (semester_id) REFERENCES public.semesters(semester_id) NOT VALID;


--
-- TOC entry 4703 (class 2606 OID 17468)
-- Name: semesters semesters_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semesters
    ADD CONSTRAINT semesters_year_id_fkey FOREIGN KEY (year_id) REFERENCES public.years(year_id) ON DELETE CASCADE;


--
-- TOC entry 4704 (class 2606 OID 17485)
-- Name: teacher_course_assignments teacher_course_assignments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_course_assignments
    ADD CONSTRAINT teacher_course_assignments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(course_id) ON DELETE CASCADE;


--
-- TOC entry 4705 (class 2606 OID 17490)
-- Name: teacher_course_assignments teacher_course_assignments_semester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_course_assignments
    ADD CONSTRAINT teacher_course_assignments_semester_id_fkey FOREIGN KEY (semester_id) REFERENCES public.semesters(semester_id) ON DELETE CASCADE;


--
-- TOC entry 4706 (class 2606 OID 17480)
-- Name: teacher_course_assignments teacher_course_assignments_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_course_assignments
    ADD CONSTRAINT teacher_course_assignments_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(teacher_id) ON DELETE CASCADE;


-- Completed on 2024-09-29 19:11:42

--
-- PostgreSQL database dump complete
--

