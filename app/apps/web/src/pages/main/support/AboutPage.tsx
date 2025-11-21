import { motion } from "framer-motion"
import {
  Users,
  Target,
  Award,
  Heart,
  Globe,
  Lightbulb,
  Shield,
  Zap,
  Rocket,
  Sparkles,
  Building2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const values = [
  {
    icon: Users,
    title: "User-Centric",
    description:
      "We put our users at the center of everything we do, constantly listening to feedback and evolving our platform to meet their needs."
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We embrace cutting-edge technology and creative solutions to solve complex problems and drive meaningful change."
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description:
      "We maintain the highest standards of security and privacy, ensuring our users can trust us with their most important data."
  },
  {
    icon: Heart,
    title: "Accessibility",
    description:
      "We believe technology should be accessible to everyone, regardless of ability, background, or technical expertise."
  }
]

const stats = [
  { number: "10K+", label: "Users", description: "Trust our platform" },
  { number: "99.9%", label: "Uptime", description: "Reliable service" },
  { number: "50+", label: "Countries", description: "Global reach" },
  { number: "24/7", label: "Support", description: "Always available" }
]

const timeline = [
  {
    year: "2020",
    title: "Platform launched",
    description:
      "We started with a vision to create powerful, accessible tools for modern teams.",
    icon: Rocket
  },
  {
    year: "2021",
    title: "Growing globally",
    description:
      "Expanded our reach and introduced new features based on user feedback.",
    icon: Globe
  },
  {
    year: "2022",
    title: "Enterprise ready",
    description:
      "Added enterprise-grade security and compliance features for larger organizations.",
    icon: Shield
  },
  {
    year: "2023",
    title: "Community focused",
    description:
      "Launched community features and open design system for better collaboration.",
    icon: Sparkles
  }
]

const cultureHighlights = [
  {
    icon: Target,
    title: "Mission-Driven",
    description:
      "Every roadmap decision traces back to the customer outcomes we want to unlock. We win when our users do."
  },
  {
    icon: Award,
    title: "Design Excellence",
    description:
      "We obsess over craftsmanship—from micro-interactions to system architecture—so every touchpoint feels delightful."
  },
  {
    icon: Building2,
    title: "Inclusive Growth",
    description:
      "We invest in diverse, distributed teams because innovation thrives when different perspectives collide."
  }
]

export function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 right-12 h-72 w-72 rounded-full bg-primary/25 opacity-50 blur-3xl" />
        <div className="absolute left-0 top-1/4 h-[22rem] w-[22rem] rounded-full bg-purple-500/20 opacity-50 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-96 w-96 rounded-full bg-blue-500/10 opacity-60 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <motion.div
          className="mx-auto mb-20 max-w-4xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary">
            Built for modern teams
          </Badge>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-6xl">
            Creating tools that empower teams to build amazing things
          </h1>
          <p className="text-xl text-muted-foreground">
            We&apos;re a team of developers and designers passionate about creating software that makes work easier, 
            more efficient, and more enjoyable. Our goal is to provide the tools and infrastructure teams need to succeed.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg">Learn more</Button>
            <Button size="lg" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
              Get in touch
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="mb-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="rounded-2xl border border-border/60 bg-background/70 p-6 backdrop-blur"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <p className="text-3xl font-semibold text-foreground">{stat.number}</p>
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{stat.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mb-20 rounded-3xl border border-primary/20 bg-primary/10 p-10 text-center backdrop-blur md:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <div className="grid gap-10 md:grid-cols-[1.6fr_1fr] md:items-center">
            <div>
              <h2 className="text-3xl font-semibold text-foreground">Our mission</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                To create powerful, accessible tools that help teams build better software faster. 
                We believe great technology should be easy to use and available to everyone, 
                regardless of team size or technical expertise.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Badge variant="secondary" className="border border-primary/20 bg-background/80 text-primary">
                  <Target className="mr-2 h-4 w-4" />
                  Mission Driven
                </Badge>
                <Badge variant="secondary" className="border border-primary/20 bg-background/80 text-primary">
                  <Globe className="mr-2 h-4 w-4" />
                  Global Impact
                </Badge>
                <Badge variant="secondary" className="border border-primary/20 bg-background/80 text-primary">
                  <Zap className="mr-2 h-4 w-4" />
                  Innovation First
                </Badge>
              </div>
            </div>
            <Card className="border border-transparent bg-background/80 shadow-md backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">How we work</CardTitle>
                <CardDescription>
                  We focus on user feedback, iterate quickly, and ship features that solve real problems 
                  for our community.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </motion.div>

        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <h2 className="mb-10 text-center text-3xl font-semibold text-foreground">Our values</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <Card className="h-full border border-transparent bg-background/70 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <value.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{value.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <h2 className="mb-10 text-center text-3xl font-semibold text-foreground">Our journey</h2>
          <div className="relative mx-auto max-w-3xl space-y-8">
            <div className="absolute inset-y-0 left-6 w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent md:left-8" />
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <div className="relative rounded-2xl border border-border/60 bg-background/70 p-6 pl-16 backdrop-blur md:pl-20">
                  <div className="absolute left-6 top-6 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-primary/30 bg-background/90 backdrop-blur md:left-8">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">{item.year}</p>
                  <h3 className="mt-3 text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mb-20 grid gap-10 rounded-3xl border border-border/80 bg-background/70 p-10 backdrop-blur md:grid-cols-[1.6fr_1fr]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          <div>
            <h2 className="text-3xl font-semibold text-foreground">Our story</h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Founded in 2020, we started with a simple goal: create better tools for modern teams. 
              We saw too many great ideas fail not because they weren&apos;t good, but because the tools 
              to bring them to life were either too expensive or too complicated.
            </p>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Today, we&apos;re proud to serve thousands of users worldwide, from solo developers to 
              large teams. Our platform continues to evolve based on the feedback and needs of our community.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {cultureHighlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="flex items-center gap-3 rounded-2xl border border-muted/40 bg-background/80 px-4 py-3"
                >
                  <highlight.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">{highlight.title}</span>
                </div>
              ))}
            </div>
          </div>
          <Card className="border border-transparent bg-primary/10 shadow-md backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Community highlights</CardTitle>
              <CardDescription className="text-base text-primary/80">
                • 100+ community events<br />
                • 50+ ecosystem partners<br />
                • 90% of features influenced by user feedback
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          className="rounded-3xl border border-primary/30 bg-primary/10 px-10 py-12 text-center backdrop-blur"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
        >
          <p className="text-sm font-medium uppercase tracking-widest text-primary">Join our community</p>
          <h3 className="mt-4 text-3xl font-semibold text-foreground">
            Help us build tools that empower the next generation of developers.
          </h3>
          <p className="mt-3 text-muted-foreground">
            Explore how our platform can accelerate your development—or join our team.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg">Get started</Button>
            <Button size="lg" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
              Contact us
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
