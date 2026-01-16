import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import { LiveSystem } from "./components/LiveSystem";
import { api, routes } from "./lib/http";

type Project = {
  id: string;
  name: string;
  description: string;
  techStack: string[];
};

type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  bullets: string[];
};

function TopNav() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium ${isActive ? "text-gray-900" : "text-gray-700/80 hover:text-gray-900"}`;

  return (
    <div className="topnav">
      <div className="container-page flex items-center justify-between py-3">
        <Link to="/" className="text-sm font-semibold muted-strong">
          carlosolson.com
        </Link>

        <nav className="flex gap-5 text-sm">
          <NavLink className={linkClass} to="/">
            Home
          </NavLink>
          <NavLink className={linkClass} to="/experience">
            Experience
          </NavLink>
          <NavLink className={linkClass} to="/projects">
            Projects
          </NavLink>
          <NavLink className={linkClass} to="/about">
            About
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="container-page pt-16">
      <div className="surface-muted p-10">
        <p className="text-sm font-medium muted">
          Lead/Staff-track Backend & Platform Engineering • Java 17 • Spring Boot • Go • Kubernetes
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900">
          Pragmatic, production-minded systems — boring, observable, and safe to change.
        </h1>

        <p className="mt-4 max-w-2xl muted">
          This platform is a small but real system: a Spring Boot BFF, a Go microservice, Kubernetes (kind/k3s), and
          operational visibility via Actuator/Prometheus. It’s designed to be inspected like production — not presented
          like a demo.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#system" className="btn-primary">
            View Live System
          </a>
          <Link to="/projects" className="btn-secondary">
            Projects
          </Link>
          <Link to="/experience" className="btn-secondary">
            Experience
          </Link>
          <a href="https://github.com/noctemlabs/carlos-portfolio" className="btn-secondary">
            GitHub Repo
          </a>
        </div>
      </div>
    </section>
  );
}

function Section(props: { id: string; title: string; body: string; bullets: string[] }) {
  return (
    <section id={props.id} className="container-page py-16">
      <h2 className="text-2xl font-semibold text-gray-900">{props.title}</h2>
      <p className="mt-2 max-w-3xl muted">{props.body}</p>
      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {props.bullets.map((b) => (
          <li key={b} className="chip">
            {b}
          </li>
        ))}
      </ul>
    </section>
  );
}

function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setError(null);
        const res = await api.get<Project[]>(routes.projects);
        if (!cancelled) setProjects(res.data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load projects");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="container-page py-16">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Featured Projects</h2>
          <p className="mt-2 max-w-3xl muted">
            Pulled live from the backend. These are intentionally “production-shaped” systems: clear boundaries, stable
            contracts, and operational visibility.
          </p>
        </div>
        <Link to="/projects" className="btn-secondary whitespace-nowrap">
          View all
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-red-700">{error}</div>
      )}

      {!error && projects === null && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700/70">
          Loading projects…
        </div>
      )}

      {projects && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {projects.slice(0, 4).map((p) => (
            <div key={p.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{p.name}</div>
                  <div className="mt-2 text-sm text-gray-700/70">{p.description}</div>
                </div>
                <Link to="/projects" className="text-sm font-medium text-gray-900 hover:underline">
                  Details
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {p.techStack.slice(0, 8).map((t) => (
                  <span key={t} className="rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function FeaturedExperience() {
  const [items, setItems] = useState<ExperienceItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setError(null);
        const res = await api.get<ExperienceItem[]>(routes.experience);
        if (!cancelled) setItems(res.data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load experience");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="container-page py-16">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Featured Experience</h2>
          <p className="mt-2 max-w-3xl muted">
            Live from the backend. Emphasis on modernization, platform boundaries, and change safety.
          </p>
        </div>
        <Link to="/experience" className="btn-secondary whitespace-nowrap">
          View all
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-red-700">{error}</div>
      )}

      {!error && items === null && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700/70">
          Loading experience…
        </div>
      )}

      {items && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.slice(0, 2).map((it) => (
            <div key={`${it.company}-${it.period}`} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="text-sm font-semibold text-gray-900">{it.company}</div>
                <div className="text-xs text-gray-700/70">{it.period}</div>
              </div>

              <div className="mt-1 text-sm font-medium text-gray-700">{it.role}</div>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700/80">
                {it.bullets.slice(0, 2).map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ObservabilityShowcase() {
  return (
    <section id="ops" className="container-page py-16">
      <h2 className="text-2xl font-semibold text-gray-900">Reliability & Observability</h2>

      <p className="mt-2 max-w-3xl muted">
        This system exposes JVM- and request-level metrics via Spring Boot Actuator + Micrometer, scraped by Prometheus and
        visualized in Grafana. The focus is on the signals needed to operate JVM services safely: heap/non-heap utilization,
        GC pauses, thread count, and CPU/load.
      </p>

      <div className="mt-8 surface p-4">
        <img
          src="/images/spring-boot-micrometer.png"
          alt="Grafana Spring Boot Micrometer dashboard showing heap, non-heap, CPU/load, threads, and GC pause durations"
          className="w-full rounded-2xl border border-gray-200"
          loading="lazy"
        />
        <p className="mt-3 text-xs muted">
          Frontend BFF JVM metrics (Micrometer → Prometheus → Grafana): heap/non-heap usage, GC pause durations, thread count,
          and CPU/load over the last hour.
        </p>
      </div>

      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        <li className="chip">Actuator + Micrometer instrumentation (JVM + HTTP).</li>
        <li className="chip">Prometheus scraping via ServiceMonitor.</li>
        <li className="chip">Dashboards curated for signal over noise.</li>
        <li className="chip">Readiness/liveness patterns for safe rollouts.</li>
      </ul>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <LiveSystem />
      <FeaturedProjects />
      <FeaturedExperience />

      <Section
        id="architecture"
        title="Architecture"
        body="A clean, explainable system: BFF orchestration, a single-responsibility Go service, and observability-first operations."
        bullets={[
          "Frontend BFF (Spring Boot): orchestration, contract stability, controlled change surface.",
          "Profile Service (Go): boring, fast, minimal dependencies.",
          "Kubernetes: declarative manifests, single-node constraint, clear migration path.",
          "Metrics and dashboards: Prometheus + Grafana with ServiceMonitors.",
        ]}
      />

      <ObservabilityShowcase />

      <Section
        id="cicd"
        title="CI/CD"
        body="Automated builds and deployments with minimal magic and clear release signals."
        bullets={[
          "GitHub Actions build + push images to GHCR.",
          "Self-hosted runner on Raspberry Pi for realism.",
          "Semantic release + changelog for auditability.",
          "Staging deployment pipeline and upgrade path to EC2.",
        ]}
      />
    </>
  );
}

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setError(null);
        const res = await api.get<Project[]>(routes.projects);
        if (!cancelled) setProjects(res.data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load projects");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="container-page py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Projects</h1>
      <p className="mt-3 max-w-3xl muted">
        These projects are intentionally production-shaped. Rather than isolated demos, they model the kinds of systems I build
        and operate professionally: explicit API contracts, clear service boundaries, observability by default, and infrastructure
        choices that favor reliability over novelty.
        <br />
        <br />
        Each project emphasizes a specific concern—API orchestration, service decomposition, operational visibility, or deployment
        safety—while keeping the overall system small enough to be reasoned about end-to-end. The goal is not to showcase every
        technology, but to demonstrate sound engineering judgment and real-world tradeoffs.
      </p>

      {error && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-red-700">{error}</div>
      )}

      {!error && projects === null && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700/70">Loading…</div>
      )}

      {projects && (
        <div className="mt-8 grid gap-4">
          {projects.map((p) => (
            <div key={p.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="text-lg font-semibold text-gray-900">{p.name}</div>
              <div className="mt-2 text-sm text-gray-700/70">{p.description}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.techStack.map((t) => (
                  <span key={t} className="rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ExperiencePage() {
  const [items, setItems] = useState<ExperienceItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setError(null);
        const res = await api.get<ExperienceItem[]>(routes.experience);
        if (!cancelled) setItems(res.data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load experience");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="container-page py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Experience</h1>
      <p className="mt-3 max-w-3xl muted">
        My experience centers on stabilizing and modernizing backend and API platforms in complex enterprise environments. I’ve
        worked across retail, healthcare, insurance, and internal tooling, often stepping into fragmented systems to clarify domain
        boundaries, reduce service sprawl, and re-establish clear API contracts.
        <br />
        <br />
        I’m typically brought in where systems have grown organically and reliability, ownership, or change safety has started to
        erode. My focus is on pragmatic improvements: simplifying architectures, making tradeoffs explicit, and leaving teams with
        systems that are easier to operate and evolve after I’m gone.
      </p>

      {error && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-red-700">{error}</div>
      )}

      {!error && items === null && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700/70">Loading…</div>
      )}

      {items && (
        <div className="mt-8 grid gap-4">
          {items.map((it) => (
            <div key={`${it.company}-${it.period}`} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="text-lg font-semibold text-gray-900">{it.company}</div>
                <div className="text-sm text-gray-700/70">{it.period}</div>
              </div>
              <div className="mt-1 text-sm font-medium text-gray-700">{it.role}</div>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700/80">
                {it.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function AboutPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [experience, setExperience] = useState<ExperienceItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const [p, e] = await Promise.all([api.get<Project[]>(routes.projects), api.get<ExperienceItem[]>(routes.experience)]);
        if (!cancelled) {
          setProjects(p.data);
          setExperience(e.data);
        }
      } catch {
        // Non-fatal; About can still render narrative.
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const projectCount = projects?.length ?? 0;
  const experienceCount = experience?.length ?? 0;

  return (
    <section className="container-page py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">About</h1>

      <p className="mt-3 max-w-3xl muted">
        I build backend and platform systems that are safe to change: stable contracts, operational clarity, and predictable
        deployments. I optimize for “boring” reliability: small services, clear boundaries, and measurable behavior.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-700/70">Projects (live)</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">{projectCount}</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-700/70">Experience entries (live)</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">{experienceCount}</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-700/70">Platform focus</div>
          <div className="mt-2 text-sm text-gray-700/80">API boundaries • observability • safe delivery • operational visibility</div>
        </div>
      </div>

      {/* Operating Principles */}
      <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold text-gray-900">Operating Principles</div>
        <p className="mt-2 text-sm text-gray-700/70">
          These principles guide how I design and operate systems. They’re informed by production failure modes, platform work,
          and engineers who emphasize clarity and long-term maintainability over cleverness.
        </p>

        <ul className="mt-4 space-y-3 text-sm text-gray-700/80">
          <li>
            <span className="font-semibold text-gray-900">Simplicity before abstraction.</span>{" "}
            Prefer the simplest design that can safely evolve. Abstractions are earned through real constraints.
          </li>
          <li>
            <span className="font-semibold text-gray-900">Explicit tradeoffs beat hidden complexity.</span>{" "}
            Constraints should be visible so teams can reason about change without surprises.
          </li>
          <li>
            <span className="font-semibold text-gray-900">Observability is part of the design.</span>{" "}
            Metrics, health checks, and logs exist to support operators; if a metric can’t be explained, it doesn’t belong.
          </li>
          <li>
            <span className="font-semibold text-gray-900">Clear boundaries matter more than framework choice.</span>{" "}
            Well-defined APIs and ownership reduce coordination cost and stabilize delivery.
          </li>
          <li>
            <span className="font-semibold text-gray-900">Optimize for change safety.</span>{" "}
            Systems should be easy to modify, roll back, and reason about under partial failure.
          </li>
          <li>
            <span className="font-semibold text-gray-900">Boring systems scale better.</span>{" "}
            Proven patterns, minimal magic, and debuggability win in production.
          </li>
        </ul>
      </div>

      {/* Resume */}
      <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-gray-900">Resume</div>
            <p className="mt-1 text-sm text-gray-700/70">
              A concise summary of roles, responsibilities, and technologies across enterprise backend and platform work.
            </p>
          </div>

          <a
            href="/resume/Carlos_Olson_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary whitespace-nowrap"
          >
            Download PDF
          </a>
        </div>
      </div>
 
      {/* Upcoming: KGL Business Policy Engine */}
      <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold text-gray-900">Coming soon: KGL Business Policy Engine</div>
        <p className="mt-2 text-sm text-gray-700/70">
          A policy engine designed for explicit rule modeling, auditable changes, and safe evaluation at runtime — suitable for
          retail and enterprise workflows. This will ship as a backend service with a UI for policy inspection and test scenarios.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-700/10 py-10">
      <div className="container-page text-sm text-gray-700/60">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} Carlos Olson</span>
          <span className="font-mono">React + TS + Tailwind • BFF + Go • k8s</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen">
      <TopNav />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>

      <Footer />
    </div>
  );
}
