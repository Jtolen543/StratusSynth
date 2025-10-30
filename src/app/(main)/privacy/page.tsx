"use client"

import { motion } from "framer-motion"
import { Shield, Eye, Lock, Database, Users, Globe, FileText, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const privacySections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: [
      "Account information (name, email, profile details)",
      "Usage data and analytics",
      "Device and browser information",
      "Communication preferences",
      "Payment and billing information (processed securely by third-party providers)"
    ]
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content: [
      "Provide and improve our services",
      "Process transactions and send related information",
      "Send technical notices and support messages",
      "Respond to your comments and questions",
      "Develop new products and services"
    ]
  },
  {
    icon: Lock,
    title: "Data Security",
    content: [
      "End-to-end encryption for sensitive data",
      "Regular security audits and penetration testing",
      "SOC 2 Type II compliance",
      "GDPR and CCPA compliance",
      "Secure data centers with 24/7 monitoring"
    ]
  },
  {
    icon: Users,
    title: "Information Sharing",
    content: [
      "We never sell your personal information",
      "Limited sharing with trusted service providers",
      "Legal compliance when required by law",
      "Business transfers (with user notification)",
      "Aggregated, anonymized data for analytics"
    ]
  },
  {
    icon: Globe,
    title: "International Transfers",
    content: [
      "Data may be transferred to countries outside your residence",
      "Adequate protection measures in place",
      "Standard Contractual Clauses (SCCs) for EU transfers",
      "Regular compliance reviews",
      "User consent for cross-border transfers"
    ]
  },
  {
    icon: FileText,
    title: "Your Rights",
    content: [
      "Access and download your data",
      "Correct inaccurate information",
      "Delete your account and data",
      "Opt-out of marketing communications",
      "Data portability to other services"
    ]
  }
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Shield className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, 
            use, and protect your information when you use our services.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            Last updated: January 15, 2024
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                At YourApp, we are committed to protecting your privacy and ensuring the security 
                of your personal information. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you visit our website or use our services.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By using our services, you agree to the collection and use of information in 
                accordance with this policy. If you do not agree with our policies and practices, 
                please do not use our services.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">GDPR Compliant</Badge>
                <Badge variant="secondary">CCPA Compliant</Badge>
                <Badge variant="secondary">SOC 2 Certified</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy Sections */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            {privacySections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <section.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <motion.div
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Cookies and Tracking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your experience, 
                  analyze usage patterns, and provide personalized content. You can control 
                  cookie preferences through your browser settings.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Children's Privacy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our services are not intended for children under 13 years of age. We do not 
                  knowingly collect personal information from children under 13. If you are a 
                  parent or guardian and believe your child has provided us with personal information, 
                  please contact us.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Changes to This Policy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any 
                  changes by posting the new Privacy Policy on this page and updating the "Last updated" 
                  date. We encourage you to review this Privacy Policy periodically.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          className="bg-muted/50 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Questions About Privacy?
          </h2>
          <p className="text-muted-foreground mb-6">
            If you have any questions about this Privacy Policy or our privacy practices, 
            please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button>
              Contact Privacy Team
            </Button>
            <Button variant="outline">
              Download Your Data
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
