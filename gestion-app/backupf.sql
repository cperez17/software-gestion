--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2024-11-05 16:09:00

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
    request_status character varying(50),
    school_id integer NOT NULL,
    course_id integer NOT NULL,
    "group" integer,
    assignment_id integer,
    CONSTRAINT course_requests_request_status_check CHECK (((request_status)::text = ANY ((ARRAY['pendiente'::character varying, 'aprobado'::character varying, 'rechazado'::character varying])::text[])))
);


ALTER TABLE public.course_requests OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 17555)
-- Name: course_requests_course_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.course_requests_course_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_requests_course_id_seq OWNER TO postgres;

--
-- TOC entry 4875 (class 0 OID 0)
-- Dependencies: 229
-- Name: course_requests_course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.course_requests_course_id_seq OWNED BY public.course_requests.course_id;


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
-- TOC entry 4876 (class 0 OID 0)
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
-- TOC entry 4877 (class 0 OID 0)
-- Dependencies: 221
-- Name: courses_course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.courses_course_id_seq OWNED BY public.courses.course_id;


--
-- TOC entry 218 (class 1259 OID 17400)
-- Name: schools; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schools (
    school_id integer NOT NULL,
    school_name character varying(255) NOT NULL
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
-- TOC entry 4878 (class 0 OID 0)
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
    year_id integer NOT NULL,
    semester_num integer,
    semester_name character varying
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
-- TOC entry 4879 (class 0 OID 0)
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
-- TOC entry 4880 (class 0 OID 0)
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
    status boolean,
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
-- TOC entry 4881 (class 0 OID 0)
-- Dependencies: 223
-- Name: teachers_teacher_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teachers_teacher_id_seq OWNED BY public.teachers.teacher_id;


--
-- TOC entry 230 (class 1259 OID 17573)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    rut character varying NOT NULL,
    password character varying NOT NULL,
    role "char" NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 17581)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 4882 (class 0 OID 0)
-- Dependencies: 231
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


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
-- TOC entry 4883 (class 0 OID 0)
-- Dependencies: 215
-- Name: years_year_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.years_year_id_seq OWNED BY public.years.year_id;


--
-- TOC entry 4672 (class 2604 OID 17415)
-- Name: course_requests request_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_requests ALTER COLUMN request_id SET DEFAULT nextval('public.course_requests_request_id_seq'::regclass);


--
-- TOC entry 4673 (class 2604 OID 17556)
-- Name: course_requests course_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_requests ALTER COLUMN course_id SET DEFAULT nextval('public.course_requests_course_id_seq'::regclass);


--
-- TOC entry 4674 (class 2604 OID 17434)
-- Name: courses course_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses ALTER COLUMN course_id SET DEFAULT nextval('public.courses_course_id_seq'::regclass);


--
-- TOC entry 4671 (class 2604 OID 17403)
-- Name: schools school_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schools ALTER COLUMN school_id SET DEFAULT nextval('public.schools_school_id_seq'::regclass);


--
-- TOC entry 4676 (class 2604 OID 17464)
-- Name: semesters semester_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semesters ALTER COLUMN semester_id SET DEFAULT nextval('public.semesters_semester_id_seq'::regclass);


--
-- TOC entry 4677 (class 2604 OID 17477)
-- Name: teacher_course_assignments assignment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_course_assignments ALTER COLUMN assignment_id SET DEFAULT nextval('public.teacher_course_assignments_assignment_id_seq'::regclass);


--
-- TOC entry 4675 (class 2604 OID 17452)
-- Name: teachers teacher_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers ALTER COLUMN teacher_id SET DEFAULT nextval('public.teachers_teacher_id_seq'::regclass);


--
-- TOC entry 4678 (class 2604 OID 17582)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 4670 (class 2604 OID 17396)
-- Name: years year_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.years ALTER COLUMN year_id SET DEFAULT nextval('public.years_year_id_seq'::regclass);


--
-- TOC entry 4858 (class 0 OID 17412)
-- Dependencies: 220
-- Data for Name: course_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_requests (request_id, request_status, school_id, course_id, "group", assignment_id) FROM stdin;
\.


--
-- TOC entry 4860 (class 0 OID 17431)
-- Dependencies: 222
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (course_id, course_name, credits, semester_id, code) FROM stdin;
136	TALLER DE INGENIERÍA II	6	32	IOCC038-17
137	TALLER DE MATERIALES DE CONSTRUCCIÓN	6	32	IOCC075-18
138	TALLER DE GEOMETRÍA DESCRIPTIVA	6	32	IOCC079-18
139	TALLER DE GEOMETRÍA DESCRIPTIVA	6	32	IOCC079-18
140	MECÁNICA RACIONAL	6	32	IOCC085-18
141	TALLER DE URBANIZACIÓN	6	32	IOCC088-18
142	TALLER DE DIBUJO EN INGENIERÍA	6	32	IOCC104-18
143	MECÁNICA RACIONAL ESTÁTICA	6	32	IOCC109-18
144	MECÁNICA RACIONAL ESTÁTICA	6	32	IOCC109-18
145	TALLER DE INTRODUCCIÓN A LOS PROCESOS CONSTRUCTIVOS	6	32	IOCC119-18
146	TALLER DE INTRODUCCIÓN A LOS PROCESOS CONSTRUCTIVOS	6	32	IOCC119-18
147	TALLER DE INTRODUCCIÓN A LOS PROCESOS CONSTRUCTIVOS	6	32	IOCC119-18
148	TALLER DE INTRODUCCIÓN A LOS PROCESOS CONSTRUCTIVOS	6	32	IOCC119-18
149	ANÁLISIS DE ESTRUCTURAS	6	32	IOCC129-18
150	MECÁNICA DE SUELOS Y LABORATORIO	6	32	IOCC146-18
151	EDIFICACIÓN EN OBRA GRUESA	6	32	IOCC153-18
152	GESTIÓN DE OPERACIONES EN LA CONSTRUCCIÓN	6	32	IOCC156-13
153	HIDRÁULICA	6	32	IOCC157-18
154	TOPOGRAFÍA GENERAL	6	32	IOCC165-18
155	ANÁLISIS DE ESTRUCTURAS ISOSTÁTICAS	6	32	IOCC166-18
156	TALLER DE REDES DE AGUA POTABLE Y ALCANTARILLADO	6	32	IOCC168-18
157	SISTEMAS ESTRUCTURALES	6	32	IOCC178-17
158	DISEÑO ESTRUCTURAL AVANZADO	6	32	IOCC195-17
159	MÉTODOS MATEMÁTICOS PARA INGENIERÍA	6	32	IOCC204-18
160	ESTRATEGIA COMPETITIVA	6	32	IOCC207-21
161	SISTEMAS Y PROCESOS CONSTRUCTIVOS	6	32	IOCC209-18
162	TOPOGRAFÍA GENERAL	6	32	IOCC219-18
163	ESTRUCTURAS METÁLICAS Y DE MADERA	6	32	IOCC241-18
164	DINÁMICA DE ESTRUCTURAS	6	32	IOCC244-18
165	HORMIGÓN ARMADO	6	32	IOCC245-18
166	DISEÑO DE ELEMENTOS DE HORMIGÓN ARMADO	6	32	IOCC248-18
167	CONSTRUCCIÓN DE OBRAS VIALES	6	32	IOCC251-18
168	DETERIORO Y REPARACIÓN DE MATERIALES DE CONSTRUCCIÓN	6	32	IOCC252-21
169	ESTRATEGIA COMPETITIVA EN CONTEXTO DE OBRAS CIVILES	6	32	IOCC253-22
170	SUSTENTABILIDAD DE MATERIALES DE CONSTRUCCIÓN	6	32	IOCC254-21
171	MECÁNICA DE SUELOS APLICADA	6	32	IOCC255-18
172	EVALUACIÓN DE PROYECTOS	6	32	IOCC256-18
173	DETERIORO Y REPARACIÓN DE MATERIALES DE CONSTRUCCIÓN EN OBRAS CIVILES	6	32	IOCC257-22
174	TALLER DE INSTALACIONES SANITARIAS	6	32	IOCC258-18
175	PROGRAMACIÓN DE OBRAS	6	32	IOCC259-18
176	INGENIERÍA SISMO RESISTENTE	6	32	IOCC269-18
177	DISEÑO ESTRUCTURAL DE PAVIMENTO	6	32	IOCC279-18
178	DISEÑO AVANZADO DE ESTRUCTURAS DE ACERO	6	32	IOCC280-18
179	INGENIERÍA AMBIENTAL	6	32	IOCC285-18
180	DISEÑO Y CONTROL DE MEZCLAS BITUMINOSAS	6	32	IOCC287-22
181	DISEÑO Y CONTROL DE MEZCLAS BITUMINOSAS	6	32	IOCC287-22
182	TALLER DE DISEÑO ESTRUCTURAL	6	32	IOCC288-18
183	GIRA DE ESTUDIOS	6	32	IOCC290-18
184	SEMINARIO DE CONSTRUCCIÓN	6	32	IOCC295-08
185	PRÁCTICA PROFESIONAL	6	32	IOCC295-18
186	TRABAJO DE TÍTULO	6	32	IOCC297-18
187	PROYECTO DE TÍTULO	6	32	IOCC298-22
188	TESIS	6	32	IOCC298-90
189	ESTRUCTURAS DE PUENTES	6	32	IOCC301-11
190	SISMOLOGÍA APLICADA	6	32	IOCC302-11
191	MODELACIÓN DEL COMPORTAMIENTO DE MATERIALES EN EL CONTEXTO DE OBRAS CIVILES	6	32	IOCC315-22
\.


--
-- TOC entry 4856 (class 0 OID 17400)
-- Dependencies: 218
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schools (school_id, school_name) FROM stdin;
2	BACHILLERATO EN CIENCIAS DE LA INGENIERÍA PLAN COMÚN 
3	INGENIERÍA EN CONSTRUCCIÓN 
4	INGENIERÍA CIVIL EN OBRAS CIVILES 
5	PROGRAMA ESPECIAL DE PREGRADO DE INTERCAMBIO 
6	BACHILLERATO EN CIENCIAS DE LA INGENIERÍA (COY)
7	ARQUITECTURA
\.


--
-- TOC entry 4864 (class 0 OID 17461)
-- Dependencies: 226
-- Data for Name: semesters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.semesters (semester_id, year_id, semester_num, semester_name) FROM stdin;
31	1	1	Semestral
32	1	2	Semestral
33	2	3	Semestral
34	2	4	Semestral
35	3	5	Anual
36	3	6	Anual
37	3	7	Anual
38	3	8	Anual
39	3	9	Anual
40	3	10	Anual
41	3	11	Anual
\.


--
-- TOC entry 4866 (class 0 OID 17474)
-- Dependencies: 228
-- Data for Name: teacher_course_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher_course_assignments (assignment_id, teacher_id, assigned_date, semester_id) FROM stdin;
\.


--
-- TOC entry 4862 (class 0 OID 17449)
-- Dependencies: 224
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teachers (teacher_id, first_name, last_name, email, phone_number, max_credits, rut_login, password, contract, status) FROM stdin;
1	Juan	Pérez	juan.perez@uach.cl	123456789	20	12345678-9	password1	Contrato A	\N
2	María	González	maria.gonzalez@uach.cl	987654321	25	98765432-1	password2	Contrato B	\N
3	Luis	Rodríguez	luis.rodriguez@uach.cl	456123789	15	45678912-3	password3	Contrato C	\N
4	Ana	Martínez	ana.martinez@uach.cl	321654987	30	32165498-7	password4	Contrato D	\N
5	Carlos	Hernández	carlos.hernandez@uach.cl	654321987	10	65432112-5	password5	Contrato E	\N
7	Juan	sotito	juan.perez@example.com	123456789	15	11111111-1	password1	Contrato A	t
10	Patricia	López	patricia.lopez@uach.cl	123789456	18	12378945-6	password6	Contrato A	t
11	Fernando	Díaz	fernando.diaz@uach.cl	789456123	22	78945612-3	password7	Contrato B	t
12	Sofía	Ramírez	sofia.ramirez@uach.cl	147258369	20	14725836-9	password8	Contrato C	t
13	Ricardo	Torres	ricardo.torres@uach.cl	258369147	12	25836914-7	password9	Contrato D	t
14	Andrea	Sánchez	andrea.sanchez@uach.cl	369147258	24	36914725-8	password10	Contrato E	t
15	Jorge	Castro	jorge.castro@uach.cl	741852963	15	74185296-3	password11	Contrato A	t
16	Claudia	Morales	claudia.morales@uach.cl	852963741	28	85296374-1	password12	Contrato B	t
17	Raúl	Gómez	raul.gomez@uach.cl	963741852	19	96374185-2	password13	Contrato C	t
18	Elena	Reyes	elena.reyes@uach.cl	951753456	17	95175345-6	password14	Contrato D	t
19	Manuel	Jiménez	manuel.jimenez@uach.cl	753951456	21	75395145-6	password15	Contrato E	t
20	Gabriela	Ortiz	gabriela.ortiz@uach.cl	456951753	20	45695175-3	password16	Contrato A	t
21	Francisco	Molina	francisco.molina@uach.cl	852147963	14	85214796-3	password17	Contrato B	t
22	Mónica	Silva	monica.silva@uach.cl	741963852	25	74196385-2	password18	Contrato C	t
23	Héctor	Vargas	hector.vargas@uach.cl	369852147	18	36985214-7	password19	Contrato D	t
24	Isabel	Peña	isabel.pena@uach.cl	123456789	23	12345678-5	password20	Contrato E	t
25	Tomás	Campos	tomas.campos@uach.cl	789123456	27	78912345-6	password21	Contrato A	t
26	Carla	Pizarro	carla.pizarro@uach.cl	147852369	16	14785236-9	password22	Contrato B	t
27	Javier	Navarro	javier.navarro@uach.cl	258741369	29	25874136-9	password23	Contrato C	t
28	Natalia	Espinoza	natalia.espinoza@uach.cl	369258147	13	36925814-5	password24	Contrato D	t
29	César	Rojas	cesar.rojas@uach.cl	456123789	20	45612378-9	password25	Contrato E	t
\.


--
-- TOC entry 4868 (class 0 OID 17573)
-- Dependencies: 230
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, rut, password, role) FROM stdin;
\.


--
-- TOC entry 4854 (class 0 OID 17393)
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
-- TOC entry 4884 (class 0 OID 0)
-- Dependencies: 229
-- Name: course_requests_course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.course_requests_course_id_seq', 5, true);


--
-- TOC entry 4885 (class 0 OID 0)
-- Dependencies: 219
-- Name: course_requests_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.course_requests_request_id_seq', 1, false);


--
-- TOC entry 4886 (class 0 OID 0)
-- Dependencies: 221
-- Name: courses_course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_course_id_seq', 191, true);


--
-- TOC entry 4887 (class 0 OID 0)
-- Dependencies: 217
-- Name: schools_school_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schools_school_id_seq', 7, true);


--
-- TOC entry 4888 (class 0 OID 0)
-- Dependencies: 225
-- Name: semesters_semester_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.semesters_semester_id_seq', 41, true);


--
-- TOC entry 4889 (class 0 OID 0)
-- Dependencies: 227
-- Name: teacher_course_assignments_assignment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teacher_course_assignments_assignment_id_seq', 1, false);


--
-- TOC entry 4890 (class 0 OID 0)
-- Dependencies: 223
-- Name: teachers_teacher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teachers_teacher_id_seq', 29, true);


--
-- TOC entry 4891 (class 0 OID 0)
-- Dependencies: 231
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, false);


--
-- TOC entry 4892 (class 0 OID 0)
-- Dependencies: 215
-- Name: years_year_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.years_year_id_seq', 1, false);


--
-- TOC entry 4687 (class 2606 OID 17419)
-- Name: course_requests course_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_requests
    ADD CONSTRAINT course_requests_pkey PRIMARY KEY (request_id);


--
-- TOC entry 4691 (class 2606 OID 17437)
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (course_id);


--
-- TOC entry 4685 (class 2606 OID 17405)
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (school_id);


--
-- TOC entry 4698 (class 2606 OID 17467)
-- Name: semesters semesters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semesters
    ADD CONSTRAINT semesters_pkey PRIMARY KEY (semester_id);


--
-- TOC entry 4700 (class 2606 OID 17479)
-- Name: teacher_course_assignments teacher_course_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_course_assignments
    ADD CONSTRAINT teacher_course_assignments_pkey PRIMARY KEY (assignment_id);


--
-- TOC entry 4694 (class 2606 OID 17459)
-- Name: teachers teachers_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_email_key UNIQUE (email);


--
-- TOC entry 4696 (class 2606 OID 17457)
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (teacher_id);


--
-- TOC entry 4702 (class 2606 OID 17587)
-- Name: users user_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_id PRIMARY KEY (user_id) INCLUDE (user_id);


--
-- TOC entry 4683 (class 2606 OID 17398)
-- Name: years years_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.years
    ADD CONSTRAINT years_pkey PRIMARY KEY (year_id);


--
-- TOC entry 4688 (class 1259 OID 17572)
-- Name: fki_assignment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_assignment_id ON public.course_requests USING btree (assignment_id);


--
-- TOC entry 4689 (class 1259 OID 17566)
-- Name: fki_course_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_course_id ON public.course_requests USING btree (course_id);


--
-- TOC entry 4692 (class 1259 OID 17500)
-- Name: fki_semester_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_semester_id ON public.courses USING btree (semester_id);


--
-- TOC entry 4703 (class 2606 OID 17567)
-- Name: course_requests assignment_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_requests
    ADD CONSTRAINT assignment_id FOREIGN KEY (assignment_id) REFERENCES public.teacher_course_assignments(assignment_id) NOT VALID;


--
-- TOC entry 4704 (class 2606 OID 17561)
-- Name: course_requests course_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_requests
    ADD CONSTRAINT course_id FOREIGN KEY (course_id) REFERENCES public.courses(course_id) NOT VALID;


--
-- TOC entry 4705 (class 2606 OID 17420)
-- Name: course_requests course_requests_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_requests
    ADD CONSTRAINT course_requests_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(school_id) ON DELETE CASCADE;


--
-- TOC entry 4706 (class 2606 OID 17495)
-- Name: courses semester_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT semester_id FOREIGN KEY (semester_id) REFERENCES public.semesters(semester_id) NOT VALID;


--
-- TOC entry 4707 (class 2606 OID 17468)
-- Name: semesters semesters_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semesters
    ADD CONSTRAINT semesters_year_id_fkey FOREIGN KEY (year_id) REFERENCES public.years(year_id) ON DELETE CASCADE;


--
-- TOC entry 4708 (class 2606 OID 17490)
-- Name: teacher_course_assignments teacher_course_assignments_semester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_course_assignments
    ADD CONSTRAINT teacher_course_assignments_semester_id_fkey FOREIGN KEY (semester_id) REFERENCES public.semesters(semester_id) ON DELETE CASCADE;


--
-- TOC entry 4709 (class 2606 OID 17480)
-- Name: teacher_course_assignments teacher_course_assignments_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_course_assignments
    ADD CONSTRAINT teacher_course_assignments_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(teacher_id) ON DELETE CASCADE;


-- Completed on 2024-11-05 16:09:00

--
-- PostgreSQL database dump complete
--

