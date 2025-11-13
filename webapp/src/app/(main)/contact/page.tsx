"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Clock, MessageSquare, Headphones, Users, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email within 24 hours",
    contact: "support@example.com",
    action: "Send Email"
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak with our support team",
    contact: "+1 (555) 123-4567",
    action: "Call Now"
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with us in real-time",
    contact: "Available 9 AM - 6 PM EST",
    action: "Start Chat"
  },
  {
    icon: Headphones,
    title: "Enterprise Support",
    description: "Dedicated support for enterprise customers",
    contact: "enterprise@example.com",
    action: "Contact Sales"
  }
]

const supportTopics = [
  {
    icon: Users,
    title: "Account & Billing",
    description: "Questions about your account, billing, or subscription"
  },
  {
    icon: Zap,
    title: "Technical Support",
    description: "Help with technical issues, bugs, or feature requests"
  },
  {
    icon: MessageSquare,
    title: "General Inquiry",
    description: "General questions, feedback, or partnership opportunities"
  }
]

const responseHighlights = [
  {
    icon: Clock,
    value: "~2 hrs",
    label: "Average reply time"
  },
  {
    icon: Headphones,
    value: "24/7",
    label: "Support coverage"
  },
  {
    icon: MessageSquare,
    value: "4.8/5",
    label: "Customer satisfaction"
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    topic: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 right-10 h-64 w-64 rounded-full bg-primary/30 opacity-40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-purple-500/20 opacity-40 blur-3xl" />
        <div className="absolute top-1/2 -left-24 h-72 w-72 rounded-full bg-blue-500/10 opacity-60 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <motion.div
          className="mx-auto mb-20 max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary">
            We&apos;re here to help
          </Badge>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-6xl">
            Get in touch with our team
          </h1>
          <p className="text-xl text-muted-foreground">
            Whether you need technical help, have questions about our platform, or want to explore 
            enterprise solutions, we&apos;re here to help.
          </p>
        </motion.div>

        <motion.div
          className="mb-16 grid gap-6 md:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {responseHighlights.map((item, index) => (
            <motion.div
              key={item.label}
              className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/60 p-6 backdrop-blur"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-semibold text-foreground">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mb-20 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-semibold text-foreground">Choose how you&apos;d like to connect</h2>
                <p className="mt-2 text-muted-foreground">
                  Pick the channel that suits you best—we respond with the same urgency everywhere.
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Multiple support channels
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-5">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="group relative rounded-2xl border border-muted/50 bg-background/70 p-[1px] backdrop-blur transition hover:border-primary/60 hover:bg-primary/10">
                    <div className="h-full w-full rounded-[1rem] bg-background/90 p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:scale-105">
                            <method.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{method.title}</h3>
                            <p className="text-sm text-muted-foreground">{method.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 sm:text-right">
                          <span className="text-sm text-muted-foreground">{method.contact}</span>
                          <Button variant="ghost" className="group-hover:bg-primary/10">
                            {method.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border border-primary/20 bg-background/70 shadow-xl backdrop-blur">
              <CardHeader className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Typically responds in under 2 hours
                </div>
                <CardTitle className="text-2xl">Send us a message</CardTitle>
                <CardDescription>
                  Tell us what you need and we&apos;ll connect you with the right person.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Your name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Jane Cooper"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Work email</Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Label htmlFor="topic">Topic</Label>
                    <Select
                      value={formData.topic}
                      onValueChange={(value) => setFormData({ ...formData, topic: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="account">Account & Billing</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="How can we help?"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="Share as many details as possible..."
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-semibold text-foreground">What can we help you with?</h2>
            <p className="mt-3 text-muted-foreground">
              Our team covers every aspect of our platform, from technical support to business inquiries.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {supportTopics.map((topic, index) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <Card className="h-full border border-transparent bg-background/70 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                      <topic.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                    <CardDescription>{topic.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="rounded-3xl border border-border/80 bg-background/60 p-10 text-center backdrop-blur"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <MapPin className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Office Location</h3>
              <p className="text-muted-foreground">
                123 Business Street<br />
                San Francisco, CA 94105<br />
                United States
              </p>
            </div>
            <div className="space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Business Hours</h3>
              <p className="text-muted-foreground">
                Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                Saturday: 10:00 AM - 4:00 PM EST<br />
                Sunday: Closed
              </p>
            </div>
            <div className="space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Phone className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Emergency Support</h3>
              <p className="text-muted-foreground">
                24/7 Emergency Support<br />
                Available for Enterprise customers<br />
                +1 (555) 911-SUPPORT
              </p>
            </div>
          </div>
        </motion.div>

        {/* <motion.div
          className="mt-16 rounded-3xl border border-primary/30 bg-primary/10 px-10 py-12 text-center backdrop-blur"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Prefer to talk?
          </p>
          <h3 className="mt-4 text-3xl font-semibold text-foreground">
            Schedule a demo with our team.
          </h3>
          <p className="mt-3 text-muted-foreground">
            Discover how our platform can help your team in a personalized 30-minute session.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg">Book a demo</Button>
            <Button size="lg" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
              View documentation
            </Button>
          </div>
        </motion.div> */}
      </div>
    </div>
  )
}
